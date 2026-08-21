"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

type PhotoRevealProps = {
  baseSrc: string;
  revealSrc: string;
  alt: string;
  className?: string;
};

function getRadius() {
  return Math.round(Math.min(420, Math.max(160, window.innerWidth * 0.16)));
}

/**
 * Two photos in the same box: the base is always visible, the reveal is
 * masked to a soft circular spotlight that trails the cursor. Desktop/mouse
 * only — touch devices just get the base photo, no emulated hover.
 */
export function PhotoReveal({ baseSrc, revealSrc, alt, className }: PhotoRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const smooth = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);

  useEffect(() => {
    const isCoarsePointer = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    if (isCoarsePointer) return;

    const container = containerRef.current;
    const revealEl = revealRef.current;
    if (!container || !revealEl) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resizeCanvas() {
      const rect = container!.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    }
    resizeCanvas();

    function handleMouseMove(event: MouseEvent) {
      const rect = container!.getBoundingClientRect();
      mouse.current.x = event.clientX - rect.left;
      mouse.current.y = event.clientY - rect.top;
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", resizeCanvas);

    function tick() {
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.1;
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.1;

      const { x, y } = smooth.current;
      const radius = getRadius();

      ctx!.clearRect(0, 0, canvas.width, canvas.height);
      const gradient = ctx!.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0.0, "rgba(255,255,255,1)");
      gradient.addColorStop(0.4, "rgba(255,255,255,1)");
      gradient.addColorStop(0.6, "rgba(255,255,255,0.75)");
      gradient.addColorStop(0.75, "rgba(255,255,255,0.4)");
      gradient.addColorStop(0.88, "rgba(255,255,255,0.12)");
      gradient.addColorStop(1.0, "rgba(255,255,255,0)");
      ctx!.fillStyle = gradient;
      ctx!.fillRect(0, 0, canvas.width, canvas.height);

      const dataUrl = canvas.toDataURL();
      revealEl!.style.maskImage = `url(${dataUrl})`;
      revealEl!.style.webkitMaskImage = `url(${dataUrl})`;

      rafId.current = requestAnimationFrame(tick);
    }
    rafId.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div ref={containerRef} className={className}>
      <Image src={baseSrc} alt={alt} fill priority sizes="50vw" className="object-cover" />
      <div
        ref={revealRef}
        className="absolute inset-0"
        style={{ maskSize: "100% 100%", WebkitMaskSize: "100% 100%" }}
      >
        <Image src={revealSrc} alt="" fill sizes="50vw" className="object-cover" />
      </div>
    </div>
  );
}
