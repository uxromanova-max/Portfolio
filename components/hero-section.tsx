"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import type { PointerEvent, ReactNode } from "react";
import { PhotoReveal } from "@/components/photo-reveal";
import { SiteHeader } from "@/components/site-header";
import { useParallaxEnabled } from "@/lib/use-parallax-enabled";
import type { HeroContent, NavItem } from "@/lib/content/types";

type HeroSectionProps = {
  nav: NavItem[];
  hero: HeroContent;
};

type ParallaxLayerProps = {
  x: MotionValue<number>;
  y: MotionValue<number>;
  depth: number;
  className?: string;
  children: ReactNode;
};

function ParallaxLayer({ x, y, depth, className, children }: ParallaxLayerProps) {
  const translateX = useTransform(x, (value) => value * depth);
  const translateY = useTransform(y, (value) => value * depth);

  return (
    <motion.div className={className} style={{ translateX, translateY }}>
      {children}
    </motion.div>
  );
}

export function HeroSection({ nav, hero }: HeroSectionProps) {
  const parallaxEnabled = useParallaxEnabled();

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 60, damping: 20, mass: 0.5 });
  const springY = useSpring(pointerY, { stiffness: 60, damping: 20, mass: 0.5 });

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    if (!parallaxEnabled) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function handlePointerLeave() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <section
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative flex w-full flex-col gap-10 overflow-hidden bg-[#f3f3f3] py-10 lg:block lg:h-dvh lg:gap-0 lg:py-0"
    >
      {/* Grid bg — excluded from parallax, desktop-only texture */}
      <div className="absolute inset-0 hidden lg:block" aria-hidden>
        <Image src="/images/grid-bg.svg" alt="" fill priority className="object-cover" />
      </div>

      {/* Header nav + CTA — excluded from parallax */}
      <SiteHeader nav={nav} ctaLabel={hero.ctaLabel} ctaHref={hero.ctaHref} />

      <ParallaxLayer
        x={springX}
        y={springY}
        depth={20}
        className="relative z-10 px-6 lg:absolute lg:left-[4.375%] lg:top-[127px] lg:px-0"
      >
        <h1 className="font-headline text-[clamp(1.5rem,7.5vw,3.875rem)] leading-[1.03] text-black uppercase lg:text-[3.875rem] lg:whitespace-nowrap">
          {hero.headlineLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
      </ParallaxLayer>

      {/* Eyebrow + supporting line are one group: their relative position and the gap
          between them never change, so they share a single parallax layer and bottom anchor
          rather than being positioned independently */}
      <ParallaxLayer
        x={springX}
        y={springY}
        depth={15}
        className="relative z-10 flex flex-col gap-2 lg:absolute lg:left-[9.53%] lg:bottom-[102px] lg:gap-3"
      >
        <p className="pr-6 pl-[33%] text-[clamp(0.875rem,4vw,1.25rem)] uppercase lg:pr-0 lg:pl-0 lg:text-[1.25rem]">
          {hero.eyebrowKicker}
        </p>
        <p className="px-6 text-[clamp(1.1rem,5vw,1.75rem)] uppercase leading-[1.15] lg:w-[449px] lg:px-0 lg:ml-[71px] lg:text-[1.75rem]">
          {hero.headlineSupportingLine.map((segment) => (
            <span
              key={segment.text}
              className={segment.highlight ? "text-[#5095a4]" : undefined}
            >
              {segment.text}
            </span>
          ))}
        </p>
      </ParallaxLayer>

      {/* Photo + signature share a coordinate frame — signature overlays the photo's corner on
          mobile, and is pinned relative to the photo box (not the viewport) on desktop, since
          the photo itself is bottom-anchored and its on-screen position shifts with viewport height */}
      <div className="relative lg:absolute lg:bottom-0 lg:left-[52.34%] lg:aspect-[610/490] lg:w-[47.66%]">
        <ParallaxLayer
          x={springX}
          y={springY}
          depth={10}
          className="relative z-0 aspect-[402/322] w-full lg:absolute lg:inset-0 lg:aspect-auto lg:h-full lg:w-full"
        >
          <Image
            src={hero.photo.mobile}
            alt={hero.signatureName}
            fill
            priority
            sizes="100vw"
            className="block object-cover lg:hidden"
          />
          <PhotoReveal
            baseSrc={hero.photo.desktop}
            revealSrc={hero.photo.desktopAfter}
            alt={hero.signatureName}
            className="absolute inset-0 hidden lg:block"
          />
        </ParallaxLayer>

        <ParallaxLayer
          x={springX}
          y={springY}
          depth={12}
          className="absolute left-6 top-8 z-10 max-w-[80px] lg:left-[47.7%] lg:top-[-16px] lg:max-w-none"
        >
          <p className="text-[clamp(0.7rem,0.95vw,0.875rem)] lg:text-[0.875rem] lg:whitespace-nowrap">
            {hero.signatureName}
          </p>
        </ParallaxLayer>
      </div>
    </section>
  );
}
