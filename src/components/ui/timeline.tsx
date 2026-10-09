"use client";
/**
 * Aceternity Timeline, adapted:
 * - the demo heading/intro is replaced by an optional `header` slot;
 * - theme tokens instead of neutral/purple colours (works in contrast mode);
 * - the line height follows content size changes (images loading) via ResizeObserver;
 * - sticky labels sit below the fixed top navbar;
 * - reduced motion shows the full line instead of drawing it on scroll.
 */
import { useScroll, useTransform, motion, useReducedMotion } from "motion/react";
import React, { useEffect, useRef, useState } from "react";

export interface TimelineEntry {
  title: string;
  /** Small line under the title on wide screens (e.g. "Actual"). */
  subtitle?: string;
  content: React.ReactNode;
}

export const Timeline = ({ data, header }: { data: TimelineEntry[]; header?: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setHeight(el.getBoundingClientRect().height);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div className="w-full md:px-10" ref={containerRef}>
      {header ? <div className="mx-auto max-w-7xl px-4 pt-24 sm:px-8 md:pt-32 lg:px-10">{header}</div> : null}

      <div ref={ref} className="relative mx-auto max-w-7xl pb-20">
        {data.map((item) => (
          <div key={item.title + (item.subtitle ?? "")} className="flex justify-start pt-10 md:gap-10 md:pt-32">
            <div className="sticky top-32 z-30 flex max-w-xs flex-col items-center self-start md:w-full md:flex-row lg:max-w-sm">
              <div className="absolute left-3 flex size-10 items-center justify-center rounded-full bg-background md:left-3">
                <div className="size-4 rounded-full border border-sand/60 bg-moss/40 p-2 contrast:border-foreground contrast:bg-foreground" />
              </div>
              <div className="hidden md:block md:pl-20">
                <h3 className="font-heading text-4xl font-medium text-muted-foreground lg:text-5xl">{item.title}</h3>
                {item.subtitle ? <p className="mt-2 text-sm tracking-[0.2em] text-sand uppercase contrast:text-foreground">{item.subtitle}</p> : null}
              </div>
            </div>

            <div className="relative w-full pr-4 pl-20 md:pl-4">
              <div className="mb-4 md:hidden">
                <h3 className="font-heading text-2xl font-medium text-muted-foreground">{item.title}</h3>
                {item.subtitle ? <p className="mt-1 text-xs tracking-[0.2em] text-sand uppercase contrast:text-foreground">{item.subtitle}</p> : null}
              </div>
              {item.content}
            </div>
          </div>
        ))}
        <div
          aria-hidden="true"
          style={{ height: height + "px" }}
          className="absolute top-0 left-8 w-[2px] overflow-hidden bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-border to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] md:left-8"
        >
          <motion.div
            style={reduced ? { height } : { height: heightTransform, opacity: opacityTransform }}
            className="absolute inset-x-0 top-0 w-[2px] rounded-full bg-gradient-to-t from-moss from-[0%] via-glacier via-[10%] to-transparent contrast:from-foreground contrast:via-foreground"
          />
        </div>
      </div>
    </div>
  );
};
