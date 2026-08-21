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
        className="relative z-10 px-6 lg:absolute lg:left-[4.375%] lg:top-[15.26%] lg:w-[67.58%] lg:px-0"
      >
        <h1
          className="bg-clip-text font-headline text-[clamp(1.5rem,7.5vw,3.875rem)] leading-[0.95] text-transparent uppercase"
          style={{
            backgroundImage:
              "linear-gradient(130.57deg, rgb(0,0,0) 11.732%, rgba(0,0,0,0) 69.195%)",
          }}
        >
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
        className="relative z-10 px-6 lg:absolute lg:left-[4.375%] lg:top-[59.74%] lg:px-0"
      >
        <p className="text-[clamp(1.1rem,2.19vw,1.75rem)] uppercase">{hero.eyebrowKicker}</p>
      </ParallaxLayer>

      <ParallaxLayer
        x={springX}
        y={springY}
        depth={16}
        className="relative z-10 px-6 lg:absolute lg:left-[15.08%] lg:top-[64.54%] lg:w-[40.16%] lg:px-0"
      >
        <p className="text-[clamp(1.1rem,2.66vw,2.125rem)] leading-[1.1] uppercase">
          {hero.headlineSupportingLine}
        </p>
      </ParallaxLayer>

      <ParallaxLayer
        x={springX}
        y={springY}
        depth={10}
        className="relative z-0 aspect-[4/5] w-full lg:absolute lg:left-[24.375%] lg:top-[25.24%] lg:aspect-auto lg:h-[74.88%] lg:w-[87.19%]"
      >
        <Image
          src={hero.photo}
          alt={hero.signatureName}
          fill
          priority
          sizes="(min-width: 1024px) 90vw, 100vw"
          className="object-cover"
        />
      </ParallaxLayer>

      <ParallaxLayer
        x={springX}
        y={springY}
        depth={12}
        className="relative z-10 px-6 lg:absolute lg:left-[79.69%] lg:top-[20.31%] lg:px-0"
      >
        <p className="text-[clamp(0.7rem,0.95vw,0.875rem)] whitespace-nowrap">
          {hero.signatureName}
        </p>
      </ParallaxLayer>
    </section>
  );
}
