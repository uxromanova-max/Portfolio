"use client";

import { useState } from "react";
import Link from "next/link";
import type { NavItem } from "@/lib/content/types";

type SiteHeaderProps = {
  nav: NavItem[];
  ctaLabel: string;
  ctaHref: string;
};

const NOISE_TEXTURE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function SiteHeader({ nav, ctaLabel, ctaHref }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="relative z-20 flex items-center justify-center px-6 py-5 lg:contents">
      <Link
        href={ctaHref}
        className="flex items-center justify-center bg-white px-6 py-3 text-[clamp(0.65rem,0.85vw,0.75rem)] uppercase hover:opacity-80 transition-opacity lg:absolute lg:left-[82.66%] lg:top-[37px] lg:z-20"
      >
        {ctaLabel}
      </Link>

      <nav
        aria-label="Primary"
        className="hidden whitespace-nowrap text-[clamp(0.7rem,0.95vw,0.875rem)] uppercase lg:absolute lg:left-[17.66%] lg:top-[48px] lg:z-20 lg:flex lg:items-center lg:gap-8"
      >
        {nav.map((item) => (
          <a key={item.href} href={item.href} className="hover:opacity-60 transition-opacity">
            {item.label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        onClick={() => setMenuOpen(true)}
        aria-label="Open menu"
        aria-expanded={menuOpen}
        className="absolute right-6 top-1/2 -translate-y-1/2 lg:hidden"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M3 5H11M3 12H16M3 19H21" stroke="black" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      </button>

      {menuOpen && (
        <div
          className="fixed inset-0 z-30 bg-[rgba(215,237,242,0.55)] lg:hidden"
          style={{ backdropFilter: "blur(20px) saturate(180%)" }}
        >
          <div
            className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
            style={{ backgroundImage: NOISE_TEXTURE }}
            aria-hidden
          />

          <div className="relative flex h-full flex-col">
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="absolute right-6 top-5"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M6.758 17.243L12.001 12L17.244 17.243M17.244 6.757L12 12L6.758 6.757"
                  stroke="black"
                  strokeLinecap="square"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <nav
              aria-label="Primary"
              className="flex h-full flex-col items-end justify-center gap-8 px-10 text-sm uppercase"
            >
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="hover:opacity-60 transition-opacity"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
