"use client";
/**
 * Aceternity Carousel, adapted:
 * - ARIA carousel pattern: a region with group slides (no list markup);
 * - slides carry srcSet/sizes/alt and an `onButtonClick` action;
 * - keyboard (←/→), swipe on touch, lazy images except the first;
 * - parallax only while the pointer moves (no endless rAF per slide);
 * - off-screen slides are `inert` so their buttons are not tabbable;
 * - theme tokens; reduced motion drops the transitions.
 */
import { IconArrowNarrowRight } from "@tabler/icons-react";
import { useState, useRef, useId } from "react";
import { cn } from "@/lib/utils";

export interface SlideData {
  title: string;
  button: string;
  src: string;
  srcSet?: string;
  sizes?: string;
  alt?: string;
  /** Small line above the title (e.g. category · photo count). */
  meta?: string;
}

interface SlideProps {
  slide: SlideData;
  index: number;
  total: number;
  current: number;
  handleSlideClick: (index: number) => void;
  onButtonClick?: (index: number) => void;
}

const Slide = ({ slide, index, total, current, handleSlideClick, onButtonClick }: SlideProps) => {
  const slideRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | undefined>(undefined);
  const isCurrent = current === index;

  const setOffset = (x: number, y: number) => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      slideRef.current?.style.setProperty("--x", `${x}px`);
      slideRef.current?.style.setProperty("--y", `${y}px`);
    });
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    const el = slideRef.current;
    if (!el || !isCurrent) return;
    const r = el.getBoundingClientRect();
    setOffset(event.clientX - (r.left + Math.floor(r.width / 2)), event.clientY - (r.top + Math.floor(r.height / 2)));
  };

  const { src, srcSet, sizes, alt, button, title, meta } = slide;

  return (
    <div
      ref={slideRef}
      role="group"
      aria-roledescription="diapositiva"
      aria-label={`${index + 1} de ${total}: ${title}`}
      inert={!isCurrent}
      className="relative z-10 mx-[3vmin] flex h-[min(78vmin,34rem)] w-[min(78vmin,34rem)] flex-1 shrink-0 flex-col items-center justify-end text-center text-on-media [perspective:1200px]"
      onClick={() => handleSlideClick(index)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setOffset(0, 0)}
      style={{
        transform: isCurrent ? "scale(1) rotateX(0deg)" : "scale(0.94) rotateX(8deg)",
        transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        transformOrigin: "bottom",
      }}
    >
      <div
        className="absolute inset-0 overflow-hidden rounded-3xl border border-border bg-card transition-all duration-150 ease-out contrast:border-2"
        style={{ transform: isCurrent ? "translate3d(calc(var(--x, 0px) / 30), calc(var(--y, 0px) / 30), 0)" : "none" }}
      >
        <img
          className="absolute -inset-[10%] h-[120%] w-[120%] max-w-none object-cover transition-opacity duration-700 ease-in-out motion-reduce:transition-none"
          style={{ opacity: isCurrent ? 1 : 0.45 }}
          alt={alt ?? title}
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          loading={index === 0 ? "eager" : "lazy"}
          decoding="async"
          draggable={false}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-t from-overlay/90 via-overlay/30 to-transparent contrast:from-overlay contrast:via-overlay/60"
        />
      </div>

      <article
        className={cn(
          "relative w-full p-6 transition-opacity duration-700 ease-in-out sm:p-8",
          isCurrent ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        {meta ? <p className="text-xs tracking-[0.25em] text-on-media/80 uppercase">{meta}</p> : null}
        <h3 className="mt-2 font-heading text-[clamp(1.375rem,1.1rem+1.6vw,2.25rem)] leading-tight font-medium text-balance">
          {title}
        </h3>
        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onButtonClick?.(index);
            }}
            className="btn-marquee"
            data-variant="solid"
            style={{ "--spacing": `${(button.length * 0.78 + 2).toFixed(2)}em` } as React.CSSProperties}
          >
            <span className="btn-marquee-label">{button}</span>
            <span className="btn-marquee-track" aria-hidden="true">
              {button}
            </span>
          </button>
        </div>
      </article>
    </div>
  );
};

interface CarouselControlProps {
  type: "previous" | "next";
  title: string;
  handleClick: () => void;
}

const CarouselControl = ({ type, title, handleClick }: CarouselControlProps) => {
  return (
    <button
      type="button"
      className={cn(
        "mx-2 flex size-12 items-center justify-center rounded-full border border-border bg-card text-foreground transition duration-200 hover:-translate-y-0.5 hover:bg-muted active:translate-y-0.5 contrast:border-2",
        type === "previous" && "rotate-180",
      )}
      aria-label={title}
      onClick={handleClick}
    >
      <IconArrowNarrowRight aria-hidden="true" />
    </button>
  );
};

interface CarouselProps {
  slides: SlideData[];
  /** Accessible name of the carousel region. */
  label?: string;
  onButtonClick?: (index: number) => void;
}

export default function Carousel({ slides, label = "Carrusel", onButtonClick }: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const swipe = useRef<number | null>(null);
  const id = useId();

  const go = (i: number) => setCurrent(((i % slides.length) + slides.length) % slides.length);

  return (
    <section
      className="relative mx-auto h-[min(78vmin,34rem)] w-[min(78vmin,34rem)]"
      aria-roledescription="carrusel"
      aria-label={label}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(current - 1);
        if (e.key === "ArrowRight") go(current + 1);
      }}
      onPointerDown={(e) => {
        if (e.pointerType !== "mouse") swipe.current = e.clientX;
      }}
      onPointerUp={(e) => {
        if (swipe.current === null) return;
        const dx = e.clientX - swipe.current;
        swipe.current = null;
        if (Math.abs(dx) > 48) go(current + (dx < 0 ? 1 : -1));
      }}
      style={{ touchAction: "pan-y" }}
    >
      <div
        id={`${id}-slides`}
        className="absolute mx-[-3vmin] flex transition-transform duration-1000 ease-in-out motion-reduce:transition-none"
        style={{ transform: `translateX(-${current * (100 / slides.length)}%)` }}
      >
        {slides.map((slide, index) => (
          <Slide
            key={slide.title}
            slide={slide}
            index={index}
            total={slides.length}
            current={current}
            handleSlideClick={(i) => current !== i && go(i)}
            onButtonClick={onButtonClick}
          />
        ))}
      </div>

      <div className="absolute top-[calc(100%+1.5rem)] flex w-full items-center justify-center">
        <CarouselControl type="previous" title="Hito anterior" handleClick={() => go(current - 1)} />
        <p className="min-w-16 text-center text-sm text-muted-foreground tabular-nums" aria-live="polite">
          {current + 1} / {slides.length}
        </p>
        <CarouselControl type="next" title="Hito siguiente" handleClick={() => go(current + 1)} />
      </div>
    </section>
  );
}
