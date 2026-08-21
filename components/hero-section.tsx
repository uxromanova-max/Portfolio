"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import type { PointerEvent, ReactNode } from "react";
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
      className="relative flex w-full flex-col gap-10 overflow-hidden bg-[#f3f3f3] py-10 lg:block lg:aspect-[1280/832] lg:gap-0 lg:py-0"
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
        className="relative z-10 px-6 lg:absolute lg:left-[4.375%] lg:top-[15.26%] lg:px-0"
      >
        <h1 className="font-headline text-[clamp(1.5rem,7.5vw,3.875rem)] leading-[1.03] text-black uppercase lg:whitespace-nowrap">
          {hero.headlineLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
      </ParallaxLayer>

      <ParallaxLayer
        x={springX}
        y={springY}
        depth={14}
        className="relative z-10 pr-6 pl-[33%] lg:absolute lg:left-[9.53%] lg:top-[53%] lg:px-0"
      >
        <p className="text-[clamp(0.875rem,4vw,1.25rem)] uppercase lg:text-[clamp(0.9rem,1.56vw,1.25rem)]">
          {hero.eyebrowKicker}
        </p>
      </ParallaxLayer>

      <ParallaxLayer
        x={springX}
        y={springY}
        depth={16}
        className="relative z-10 px-6 lg:absolute lg:left-[15.08%] lg:top-[57.45%] lg:w-[35.08%] lg:px-0"
      >
        <p className="text-[clamp(1.1rem,5vw,1.75rem)] uppercase lg:text-[clamp(1rem,2.19vw,1.75rem)] leading-[1.15]">
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

      {/* Photo + signature share a coordinate frame on mobile (signature overlays the photo's corner) */}
      <div className="relative lg:contents">
        <ParallaxLayer
          x={springX}
          y={springY}
          depth={10}
          className="relative z-0 aspect-[402/322] w-full lg:absolute lg:left-[52.34%] lg:top-[25.24%] lg:aspect-auto lg:h-[58.89%] lg:w-[47.66%]"
        >
          <Image
            src={hero.photo.mobile}
            alt={hero.signatureName}
            fill
            priority
            sizes="100vw"
            className="block object-cover lg:hidden"
          />
          <Image
            src={hero.photo.desktop}
            alt={hero.signatureName}
            fill
            priority
            sizes="50vw"
            className="hidden object-cover lg:block"
          />
        </ParallaxLayer>

        <ParallaxLayer
          x={springX}
          y={springY}
          depth={12}
          className="absolute left-6 top-8 z-10 max-w-[80px] lg:left-[75.08%] lg:top-[23.32%] lg:max-w-none"
        >
          <p className="text-[clamp(0.7rem,0.95vw,0.875rem)] lg:whitespace-nowrap">
            {hero.signatureName}
          </p>
        </ParallaxLayer>
      </div>
    </section>
  );
}
