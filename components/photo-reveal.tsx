"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

type PhotoRevealProps = {
  baseSrc: string;
  revealSrc: string;
  alt: string;
  className?: string;
};

// Tuning knobs for the pixel-dissolve brush.
const PIXEL_SIZE = 7; // CSS px per block — small enough to read as "pixels", large enough to see
const BRUSH_MIN_RADIUS = 34;
const BRUSH_MAX_RADIUS = 64;
const BRUSH_VIEWPORT_RATIO = 0.035; // radius scales gently with viewport width, within the clamp above
const OUTER_TAIL_MULTIPLIER = 1.45; // stray particles can appear up to this far beyond the main radius
const OUTER_TAIL_STRENGTH = 0.35; // max reveal chance for those stray outer particles
const CENTER_FALLOFF_POWER = 1.7; // >1 = denser core, sparser edge
const CURSOR_SMOOTHING = 0.16;

function getBrushRadius() {
  return Math.round(
    Math.min(BRUSH_MAX_RADIUS, Math.max(BRUSH_MIN_RADIUS, window.innerWidth * BRUSH_VIEWPORT_RATIO))
  );
}

// Deterministic per-block hash so the dissolve pattern is stable in place —
// noisy/fragmented in shape, but not flickering randomly frame to frame.
function blockNoise(gx: number, gy: number) {
  let h = gx * 374761393 + gy * 668265263;
  h = (h ^ (h >>> 13)) * 1274126177;
  h = h ^ (h >>> 16);
  return (h >>> 0) / 4294967295;
}

/**
 * Two photos in the same box: the base renders normally as a DOM <img>
 * (keeps next/image's loading/priority benefits), and a transparent canvas
 * on top punches small square holes near the cursor, compositing in the
 * "reveal" photo through those blocks only. Nothing is masked with a smooth
 * gradient — every visible fragment is a discrete square, denser toward the
 * cursor's center and thinning into scattered stray blocks at the edge.
 * Desktop/mouse only — touch devices just get the base photo.
 */
export function PhotoReveal({ baseSrc, revealSrc, alt, className }: PhotoRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const smooth = useRef({ x: -9999, y: -9999 });
  const rafId = useRef<number>(0);

  useEffect(() => {
    const isCoarsePointer = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    if (isCoarsePointer) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const revealImage = new window.Image();
    revealImage.src = revealSrc;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let cssWidth = 0;
    let cssHeight = 0;

    function resizeCanvas() {
      const rect = container!.getBoundingClientRect();
      cssWidth = rect.width;
      cssHeight = rect.height;
      canvas!.width = Math.round(cssWidth * dpr);
      canvas!.height = Math.round(cssHeight * dpr);
      canvas!.style.width = `${cssWidth}px`;
      canvas!.style.height = `${cssHeight}px`;
    }
    resizeCanvas();

    function handleMouseMove(event: MouseEvent) {
      const rect = container!.getBoundingClientRect();
      mouse.current.x = event.clientX - rect.left;
      mouse.current.y = event.clientY - rect.top;
    }
    function handleMouseLeave() {
      mouse.current.x = -9999;
      mouse.current.y = -9999;
    }

    window.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", resizeCanvas);

    function tick() {
      smooth.current.x += (mouse.current.x - smooth.current.x) * CURSOR_SMOOTHING;
      smooth.current.y += (mouse.current.y - smooth.current.y) * CURSOR_SMOOTHING;

      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.clearRect(0, 0, cssWidth, cssHeight);

      const { x, y } = smooth.current;
      const radius = getBrushRadius();
      const outerRadius = radius * OUTER_TAIL_MULTIPLIER;

      if (
        revealImage.complete &&
        revealImage.naturalWidth > 0 &&
        x > -outerRadius &&
        x < cssWidth + outerRadius &&
        y > -outerRadius &&
        y < cssHeight + outerRadius
      ) {
        const scaleX = revealImage.naturalWidth / cssWidth;
        const scaleY = revealImage.naturalHeight / cssHeight;

        const startCol = Math.floor((x - outerRadius) / PIXEL_SIZE);
        const endCol = Math.ceil((x + outerRadius) / PIXEL_SIZE);
        const startRow = Math.floor((y - outerRadius) / PIXEL_SIZE);
        const endRow = Math.ceil((y + outerRadius) / PIXEL_SIZE);

        for (let row = startRow; row <= endRow; row++) {
          const blockY = row * PIXEL_SIZE;
          if (blockY + PIXEL_SIZE < 0 || blockY > cssHeight) continue;

          for (let col = startCol; col <= endCol; col++) {
            const blockX = col * PIXEL_SIZE;
            if (blockX + PIXEL_SIZE < 0 || blockX > cssWidth) continue;

            const cx = blockX + PIXEL_SIZE / 2;
            const cy = blockY + PIXEL_SIZE / 2;
            const dist = Math.hypot(cx - x, cy - y);
            if (dist > outerRadius) continue;

            let probability: number;
            if (dist <= radius) {
              probability = Math.pow(1 - dist / radius, CENTER_FALLOFF_POWER);
            } else {
              probability = ((outerRadius - dist) / (outerRadius - radius)) * OUTER_TAIL_STRENGTH;
            }
            if (probability <= 0) continue;

            if (blockNoise(col, row) < probability) {
              ctx!.drawImage(
                revealImage,
                blockX * scaleX,
                blockY * scaleY,
                PIXEL_SIZE * scaleX,
                PIXEL_SIZE * scaleY,
                blockX,
                blockY,
                PIXEL_SIZE,
                PIXEL_SIZE
              );
            }
          }
        }
      }

      rafId.current = requestAnimationFrame(tick);
    }
    rafId.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(rafId.current);
    };
  }, [revealSrc]);

  return (
    <div ref={containerRef} className={className}>
      <Image src={baseSrc} alt={alt} fill priority sizes="50vw" className="object-cover" />
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden />
    </div>
  );
}
