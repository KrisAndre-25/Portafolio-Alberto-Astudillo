"use client";

/**
 * Aceternity 3D card, extended so it does not depend on hover:
 * - mouse: tilt follows the pointer (original behaviour);
 * - touch: items keep their depth, and the card tilts with the device
 *   orientation when the browser provides it without a permission prompt,
 *   otherwise it sways very gently on its own;
 * - reduced motion: no tilt and no sway.
 */

import { cn } from "@/lib/utils";
import { useCanHover, useReducedMotion } from "@/hooks/use-media-query";

import React, {
  createContext,
  useState,
  useContext,
  useRef,
  useEffect,
} from "react";

const MouseEnterContext = createContext<
  [boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined
>(undefined);

export const CardContainer = ({
  children,
  className,
  containerClassName,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMouseEntered, setIsMouseEntered] = useState(false);
  const canHover = useCanHover();
  const reduced = useReducedMotion();

  // Touch screens: show depth and tilt with the device, or sway idly.
  useEffect(() => {
    const el = containerRef.current;
    if (!el || canHover || reduced) return;
    setIsMouseEntered(true);
    let raf = 0;
    let gyro = false;
    const onOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta === null || e.gamma === null) return;
      gyro = true;
      const x = Math.max(-8, Math.min(8, e.gamma / 4));
      const y = Math.max(-8, Math.min(8, (e.beta - 45) / 5));
      el.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
    };
    const needsPermission =
      typeof (DeviceOrientationEvent as unknown as { requestPermission?: unknown }).requestPermission === "function";
    if (!needsPermission) window.addEventListener("deviceorientation", onOrientation);
    const start = performance.now();
    const sway = (now: number) => {
      if (!gyro) {
        const t = (now - start) / 1000;
        el.style.transform = `rotateY(${Math.sin(t * 0.6) * 4}deg) rotateX(${Math.cos(t * 0.45) * 2.5}deg)`;
      }
      raf = requestAnimationFrame(sway);
    };
    raf = requestAnimationFrame(sway);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("deviceorientation", onOrientation);
      el.style.transform = "";
    };
  }, [canHover, reduced]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || reduced) return;
    const { left, top, width, height } =
      containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 25;
    const y = (e.clientY - top - height / 2) / 25;
    containerRef.current.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
  };

  const handleMouseEnter = () => {
    if (!canHover || reduced) return;
    setIsMouseEntered(true);
  };

  const handleMouseLeave = () => {
    if (!containerRef.current || !canHover) return;
    setIsMouseEntered(false);
    containerRef.current.style.transform = `rotateY(0deg) rotateX(0deg)`;
  };
  return (
    <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
      <div
        className={cn(
          "py-20 flex items-center justify-center",
          containerClassName
        )}
        style={{
          perspective: "1000px",
        }}
      >
        <div
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={cn(
            "flex items-center justify-center relative transition-all duration-200 ease-linear",
            !canHover && "transition-none",
            className
          )}
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {children}
        </div>
      </div>
    </MouseEnterContext.Provider>
  );
};

export const CardBody = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "h-96 w-96 [transform-style:preserve-3d]  [&>*]:[transform-style:preserve-3d]",
        className
      )}
    >
      {children}
    </div>
  );
};

type CardItemProps = {
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  translateX?: number | string;
  translateY?: number | string;
  translateZ?: number | string;
  rotateX?: number | string;
  rotateY?: number | string;
  rotateZ?: number | string;
} & Record<string, unknown>;

export const CardItem = ({
  as: Tag = "div",
  children,
  className,
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  ...rest
}: CardItemProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isMouseEntered] = useMouseEnter();

  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.transform = isMouseEntered
      ? `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`
      : `translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`;
  }, [isMouseEntered, translateX, translateY, translateZ, rotateX, rotateY, rotateZ]);

  return (
    <Tag
      ref={ref}
      className={cn("w-fit transition duration-200 ease-linear", className)}
      {...rest}
    >
      {children}
    </Tag>
  );
};

// Create a hook to use the context
// eslint-disable-next-line react/only-export-components
export const useMouseEnter = () => {
  const context = useContext(MouseEnterContext);
  if (context === undefined) {
    throw new Error("useMouseEnter must be used within a MouseEnterProvider");
  }
  return context;
};
