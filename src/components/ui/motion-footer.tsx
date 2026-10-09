"use client";

/**
 * CinematicFooter, from referencias/motion-footer.tsx. Changes:
 * - every demo text replaced with content from site.config (marquee, heading,
 *   giant word, contact pills, credits); no Privacy/Terms/Support links;
 * - uses the site's two fonts instead of importing Plus Jakarta Sans;
 * - heights in svh so mobile browser bars don't break the curtain;
 * - giant word sized to always fit (checked at 360px);
 * - magnetic effect only for mouse pointers; GSAP scroll animations and the
 *   marquee are skipped for reduced motion;
 * - typed refs (no `any`), accessible back-to-top button.
 */

import * as React from "react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { IconArrowUp, IconBrandLinkedin, IconBrandWhatsapp, IconMail } from "@tabler/icons-react";
import { siteConfig } from "@/config/site.config";
import { cn } from "@/lib/utils";

// Register ScrollTrigger once, in the browser only (safe for SSR and StrictMode).
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// -------------------------------------------------------------------------
// 1. THEME-ADAPTIVE INLINE STYLES (shadcn tokens, both themes)
// -------------------------------------------------------------------------
const STYLES = `
.cinematic-footer-wrapper {
  -webkit-font-smoothing: antialiased;

  --pill-bg-1: color-mix(in oklch, var(--foreground) 6%, transparent);
  --pill-bg-2: color-mix(in oklch, var(--foreground) 2%, transparent);
  --pill-shadow: color-mix(in oklch, var(--background) 50%, transparent);
  --pill-highlight: color-mix(in oklch, var(--foreground) 12%, transparent);
  --pill-inset-shadow: color-mix(in oklch, var(--background) 80%, transparent);
  --pill-border: color-mix(in oklch, var(--foreground) 14%, transparent);

  --pill-bg-1-hover: color-mix(in oklch, var(--foreground) 12%, transparent);
  --pill-bg-2-hover: color-mix(in oklch, var(--foreground) 4%, transparent);
  --pill-border-hover: color-mix(in oklch, var(--foreground) 30%, transparent);
  --pill-shadow-hover: color-mix(in oklch, var(--background) 70%, transparent);
  --pill-highlight-hover: color-mix(in oklch, var(--foreground) 20%, transparent);
}
[data-theme="contrast"] .cinematic-footer-wrapper {
  --pill-bg-1: var(--background);
  --pill-bg-2: var(--background);
  --pill-border: var(--foreground);
  --pill-border-hover: var(--foreground);
  --pill-bg-1-hover: var(--muted);
  --pill-bg-2-hover: var(--muted);
}

@keyframes footer-breathe {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
  100% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
}

@keyframes footer-scroll-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@keyframes footer-heartbeat {
  0%, 100% { transform: scale(1); filter: drop-shadow(0 0 5px color-mix(in oklch, var(--destructive) 50%, transparent)); }
  15%, 45% { transform: scale(1.2); filter: drop-shadow(0 0 10px color-mix(in oklch, var(--destructive) 80%, transparent)); }
  30% { transform: scale(1); }
}

.animate-footer-breathe {
  animation: footer-breathe 8s ease-in-out infinite alternate;
}

.animate-footer-scroll-marquee {
  animation: footer-scroll-marquee 40s linear infinite;
}

.animate-footer-heartbeat {
  animation: footer-heartbeat 2s cubic-bezier(0.25, 1, 0.5, 1) infinite;
}

@media (prefers-reduced-motion: reduce) {
  .animate-footer-breathe,
  .animate-footer-scroll-marquee,
  .animate-footer-heartbeat {
    animation: none;
  }
}

.footer-bg-grid {
  background-size: 60px 60px;
  background-image:
    linear-gradient(to right, color-mix(in oklch, var(--foreground) 3%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in oklch, var(--foreground) 3%, transparent) 1px, transparent 1px);
  mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
}

.footer-aurora {
  background: radial-gradient(
    circle at 50% 50%,
    color-mix(in oklch, var(--primary) 18%, transparent) 0%,
    color-mix(in oklch, var(--secondary) 14%, transparent) 40%,
    transparent 70%
  );
}

.footer-glass-pill {
  background: linear-gradient(145deg, var(--pill-bg-1) 0%, var(--pill-bg-2) 100%);
  box-shadow:
      0 10px 30px -10px var(--pill-shadow),
      inset 0 1px 1px var(--pill-highlight),
      inset 0 -1px 2px var(--pill-inset-shadow);
  border: 1px solid var(--pill-border);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.footer-glass-pill:hover {
  background: linear-gradient(145deg, var(--pill-bg-1-hover) 0%, var(--pill-bg-2-hover) 100%);
  border-color: var(--pill-border-hover);
  box-shadow:
      0 20px 40px -10px var(--pill-shadow-hover),
      inset 0 1px 1px var(--pill-highlight-hover);
  color: var(--foreground);
}

/* The giant word: 9 letters at 16vw stay inside the viewport from 360px up. */
.footer-giant-bg-text {
  font-family: var(--font-heading);
  font-size: min(16vw, 17rem);
  line-height: 0.75;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: transparent;
  -webkit-text-stroke: 1px color-mix(in oklch, var(--foreground) 8%, transparent);
  background: linear-gradient(180deg, color-mix(in oklch, var(--foreground) 12%, transparent) 0%, transparent 60%);
  -webkit-background-clip: text;
  background-clip: text;
}

.footer-text-glow {
  background: linear-gradient(180deg, var(--foreground) 0%, color-mix(in oklch, var(--foreground) 55%, transparent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0px 0px 20px color-mix(in oklch, var(--foreground) 15%, transparent));
}
[data-theme="contrast"] .footer-text-glow {
  background: none;
  -webkit-text-fill-color: var(--foreground);
  filter: none;
}
`;

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// -------------------------------------------------------------------------
// 2. MAGNETIC BUTTON PRIMITIVE
// -------------------------------------------------------------------------
type MagneticOwnProps<T extends React.ElementType> = {
  as?: T;
  className?: string;
  children?: React.ReactNode;
};
export type MagneticButtonProps<T extends React.ElementType = "button"> = MagneticOwnProps<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof MagneticOwnProps<T>>;

function MagneticButton<T extends React.ElementType = "button">({
  as,
  className,
  children,
  ...props
}: MagneticButtonProps<T>) {
  const Component: React.ElementType = as ?? "button";
  const localRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = localRef.current;
    // Mouse only: on touch the "magnet" would just shift the target under the finger.
    if (!element || prefersReducedMotion() || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(element, {
        x: x * 0.4,
        y: y * 0.4,
        rotationX: -y * 0.15,
        rotationY: x * 0.15,
        scale: 1.05,
        ease: "power2.out",
        duration: 0.4,
      });
    };
    const handleMouseLeave = () => {
      gsap.to(element, { x: 0, y: 0, rotationX: 0, rotationY: 0, scale: 1, ease: "elastic.out(1, 0.3)", duration: 1.2 });
    };

    const ctx = gsap.context(() => {}, element);
    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
      ctx.revert();
    };
  }, []);

  return (
    <Component ref={localRef} data-no-underline className={cn("cursor-pointer", className)} {...props}>
      {children}
    </Component>
  );
}

// -------------------------------------------------------------------------
// 3. MAIN COMPONENT
// -------------------------------------------------------------------------
const MarqueeItem = () => (
  <div className="flex items-center space-x-12 px-6">
    {siteConfig.footer.marquee.map((text, i) => (
      <React.Fragment key={text}>
        <span>{text}</span>
        <span className={i % 2 ? "text-secondary/70" : "text-primary/70"} aria-hidden="true">
          ✦
        </span>
      </React.Fragment>
    ))}
  </div>
);

const { contact, footer } = siteConfig;
const pills = [
  { label: "LinkedIn", href: contact.linkedin, Icon: IconBrandLinkedin, external: true },
  { label: "Correo", href: `mailto:${contact.email}`, Icon: IconMail, external: false },
  { label: "WhatsApp", href: contact.whatsapp, Icon: IconBrandWhatsapp, external: true },
];

export function CinematicFooter() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const giantTextRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current || prefersReducedMotion()) return;

    // gsap.context + revert: StrictMode's double mount cleans up fully.
    const ctx = gsap.context(() => {
      gsap.fromTo(
        giantTextRef.current,
        { y: "10vh", scale: 0.8, opacity: 0 },
        {
          y: "0vh",
          scale: 1,
          opacity: 1,
          ease: "power1.out",
          scrollTrigger: { trigger: wrapperRef.current, start: "top 80%", end: "bottom bottom", scrub: 1 },
        },
      );
      gsap.fromTo(
        [headingRef.current, linksRef.current],
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: wrapperRef.current, start: "top 40%", end: "bottom bottom", scrub: 1 },
        },
      );
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* Curtain: in normal flow, clip-path shows the fixed footer only inside this box. */}
      <div ref={wrapperRef} className="relative h-svh min-h-[34rem] w-full" style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}>
        <footer className="cinematic-footer-wrapper fixed bottom-0 left-0 flex h-svh min-h-[34rem] w-full flex-col justify-between overflow-hidden bg-background text-foreground">
          <div className="footer-aurora animate-footer-breathe pointer-events-none absolute top-1/2 left-1/2 z-0 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-[50%] blur-[80px]" />
          <div className="footer-bg-grid pointer-events-none absolute inset-0 z-0" />

          <div
            ref={giantTextRef}
            aria-hidden="true"
            className="footer-giant-bg-text pointer-events-none absolute bottom-[4svh] left-1/2 z-0 -translate-x-1/2 whitespace-nowrap select-none"
          >
            {footer.giantText}
          </div>

          {/* Diagonal marquee */}
          <div
            aria-hidden="true"
            className="absolute top-10 left-0 z-10 w-full -rotate-2 scale-110 overflow-hidden border-y border-border/60 bg-background/60 py-4 shadow-2xl backdrop-blur-md contrast:border-foreground"
          >
            <div className="animate-footer-scroll-marquee flex w-max text-xs font-bold tracking-[0.3em] text-muted-foreground uppercase md:text-sm">
              <MarqueeItem />
              <MarqueeItem />
            </div>
          </div>

          {/* Centre */}
          <div className="relative z-10 mx-auto mt-24 flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6">
            <h2 ref={headingRef} className="footer-text-glow mb-10 text-center text-[clamp(2.25rem,0.5rem+9vw,7rem)] leading-none font-semibold tracking-tight">
              {footer.heading}
            </h2>

            <div ref={linksRef} className="flex w-full flex-wrap justify-center gap-3 sm:gap-4">
              {pills.map(({ label, href, Icon, external }) => (
                <MagneticButton
                  key={label}
                  as="a"
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="footer-glass-pill group flex min-h-12 items-center gap-3 rounded-full px-6 py-3.5 text-sm font-semibold text-foreground sm:px-9 sm:py-4 md:text-base"
                >
                  <Icon className="size-5 text-muted-foreground transition-colors group-hover:text-foreground" aria-hidden="true" />
                  {label}
                  {external ? <span className="sr-only">(se abre en una pestaña nueva)</span> : null}
                </MagneticButton>
              ))}
            </div>
          </div>

          {/* Credits. Extra bottom padding keeps them clear of the floating dock. */}
          <div className="relative z-20 flex w-full flex-col items-center justify-between gap-4 px-6 pb-28 md:flex-row md:px-12">
            <p className="order-2 text-[11px] font-semibold tracking-widest text-muted-foreground uppercase md:order-1 md:text-xs">
              {footer.copyright}
            </p>

            <p className="footer-glass-pill order-1 flex cursor-default items-center gap-2 rounded-full px-5 py-2.5 md:order-2">
              <span className="animate-footer-heartbeat text-sm text-destructive" aria-hidden="true">
                ❤
              </span>
              <span className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase md:text-xs">{footer.credit}</span>
            </p>

            <MagneticButton
              as="button"
              type="button"
              onClick={scrollToTop}
              aria-label="Volver arriba"
              className="footer-glass-pill group order-3 flex size-12 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
            >
              <IconArrowUp className="size-5 transition-transform duration-300 group-hover:-translate-y-1" aria-hidden="true" />
            </MagneticButton>
          </div>
        </footer>
      </div>
    </>
  );
}

export default CinematicFooter;
