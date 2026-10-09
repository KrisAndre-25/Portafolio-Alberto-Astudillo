"use client";
/**
 * Aceternity DraggableCard, adapted:
 * - `onActivate` fires on a click/Enter that was not a drag (6px threshold),
 *   through a real <button> covering the card (keyboard + screen readers);
 * - `drag={false}` turns it into a still card (grid mode, touch, reduced motion),
 *   so it never blocks vertical scrolling on phones;
 * - theme tokens instead of neutral greys.
 */
import { cn } from "@/lib/utils";
import React, { createContext, useContext, useRef, useState, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
  useVelocity,
  useAnimationControls,
} from "motion/react";

const DRAG_THRESHOLD = 6;

/** The container's box, so cards can be thrown around but never off-screen. */
const BoundsContext = createContext<React.RefObject<HTMLDivElement | null> | null>(null);

export const DraggableCardBody = ({
  className,
  children,
  drag = true,
  onActivate,
  label,
}: {
  className?: string;
  children?: React.ReactNode;
  drag?: boolean;
  /** Called on click / Enter when the pointer did not drag the card. */
  onActivate?: () => void;
  /** Accessible name of the activation button. */
  label?: string;
}) => {
  const bounds = useContext(BoundsContext);
  const pressPoint = useRef<{ x: number; y: number } | null>(null);
  const dragged = useRef(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();
  const [constraints, setConstraints] = useState({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  });

  // physics biatch
  const velocityX = useVelocity(mouseX);
  const velocityY = useVelocity(mouseY);

  const springConfig = {
    stiffness: 100,
    damping: 20,
    mass: 0.5,
  };

  const rotateX = useSpring(
    useTransform(mouseY, [-300, 300], [25, -25]),
    springConfig,
  );
  const rotateY = useSpring(
    useTransform(mouseX, [-300, 300], [-25, 25]),
    springConfig,
  );

  const opacity = useSpring(
    useTransform(mouseX, [-300, 0, 300], [0.8, 1, 0.8]),
    springConfig,
  );

  const glareOpacity = useSpring(
    useTransform(mouseX, [-300, 0, 300], [0.2, 0, 0.2]),
    springConfig,
  );

  useEffect(() => {
    // Update constraints when component mounts or window resizes
    const updateConstraints = () => {
      if (typeof window !== "undefined") {
        setConstraints({
          top: -window.innerHeight / 2,
          left: -window.innerWidth / 2,
          right: window.innerWidth / 2,
          bottom: window.innerHeight / 2,
        });
      }
    };

    updateConstraints();

    // Add resize listener
    window.addEventListener("resize", updateConstraints);

    // Clean up
    return () => {
      window.removeEventListener("resize", updateConstraints);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!drag) return;
    const { clientX, clientY } = e;
    const { width, height, left, top } =
      cardRef.current?.getBoundingClientRect() ?? {
        width: 0,
        height: 0,
        left: 0,
        top: 0,
      };
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    mouseX.set(deltaX);
    mouseY.set(deltaY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      drag={drag}
      dragConstraints={bounds ?? constraints}
      dragElastic={0.15}
      onPointerDownCapture={(e) => {
        pressPoint.current = { x: e.clientX, y: e.clientY };
        dragged.current = false;
      }}
      onPointerMoveCapture={(e) => {
        const p = pressPoint.current;
        // Only movement with a button held counts as dragging.
        if (p && e.buttons !== 0 && Math.hypot(e.clientX - p.x, e.clientY - p.y) > DRAG_THRESHOLD) dragged.current = true;
      }}
      onPointerUpCapture={() => {
        pressPoint.current = null;
      }}
      onDragStart={() => {
        dragged.current = true;
        document.body.style.cursor = "grabbing";
      }}
      onDragEnd={(_event, info) => {
        document.body.style.cursor = "default";

        controls.start({
          rotateX: 0,
          rotateY: 0,
          transition: {
            type: "spring",
            ...springConfig,
          },
        });
        const currentVelocityX = velocityX.get();
        const currentVelocityY = velocityY.get();

        const velocityMagnitude = Math.sqrt(
          currentVelocityX * currentVelocityX +
            currentVelocityY * currentVelocityY,
        );
        const bounce = Math.min(0.8, velocityMagnitude / 1000);

        animate(info.point.x, info.point.x + currentVelocityX * 0.3, {
          duration: 0.8,
          ease: [0.2, 0, 0, 1],
          bounce,
          type: "spring",
          stiffness: 50,
          damping: 15,
          mass: 0.8,
        });

        animate(info.point.y, info.point.y + currentVelocityY * 0.3, {
          duration: 0.8,
          ease: [0.2, 0, 0, 1],
          bounce,
          type: "spring",
          stiffness: 50,
          damping: 15,
          mass: 0.8,
        });
      }}
      style={{
        rotateX,
        rotateY,
        opacity,
        willChange: "transform",
      }}
      animate={controls}
      whileHover={drag ? { scale: 1.02 } : undefined}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative min-h-96 w-80 overflow-hidden rounded-md bg-card p-6 text-card-foreground shadow-2xl transform-3d",
        drag ? "cursor-grab touch-none" : "touch-auto",
        className,
      )}
    >
      {children}
      {onActivate ? (
        <button
          type="button"
          aria-label={label}
          className={cn("absolute inset-0 z-20 rounded-[inherit]", drag ? "cursor-grab" : "cursor-pointer")}
          onClick={() => {
            if (!dragged.current) onActivate();
            dragged.current = false;
          }}
        />
      ) : null}
      <motion.div
        style={{
          opacity: glareOpacity,
        }}
        className="pointer-events-none absolute inset-0 bg-bone select-none contrast:hidden"
      />
    </motion.div>
  );
};

export const DraggableCardContainer = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <BoundsContext.Provider value={ref}>
      <div ref={ref} className={cn("[perspective:3000px]", className)}>{children}</div>
    </BoundsContext.Provider>
  );
};
