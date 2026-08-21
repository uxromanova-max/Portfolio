import Link from "next/link";
import type { NavItem } from "@/lib/content/types";

type SiteHeaderProps = {
  nav: NavItem[];
  ctaLabel: string;
  ctaHref: string;
};

export function SiteHeader({ nav, ctaLabel, ctaHref }: SiteHeaderProps) {
  return (
    <header className="relative z-20 flex flex-wrap items-center justify-between gap-4 px-6 py-5 lg:absolute lg:inset-x-0 lg:top-0 lg:block lg:px-0 lg:py-0">
      <nav
        aria-label="Primary"
        className="flex flex-wrap items-center gap-4 whitespace-nowrap text-[clamp(0.7rem,0.95vw,0.875rem)] uppercase lg:absolute lg:left-[17.66%] lg:top-[5.17%] lg:gap-8"
      >
        {nav.map((item) => (
          <a key={item.href} href={item.href} className="hover:opacity-60 transition-opacity">
            {item.label}
          </a>
        ))}
      </nav>
      <Link
        href={ctaHref}
        className="flex items-center justify-center bg-white px-6 py-3 text-[clamp(0.65rem,0.85vw,0.75rem)] uppercase hover:opacity-80 transition-opacity lg:absolute lg:left-[82.66%] lg:top-[3.85%]"
      >
        {ctaLabel}
      </Link>
    </header>
  );
}
