import type { Metadata } from "next";
import { HeroSection } from "@/components/hero-section";
import type { SiteContent } from "@/lib/content/types";
import brandContent from "@/content/brand.json";

const content = brandContent as SiteContent;

export const metadata: Metadata = {
  title: content.meta.pageTitle,
  robots: { index: false, follow: false },
};

export default function BrandPage() {
  return (
    <main>
      <HeroSection nav={content.nav} hero={content.hero} />
    </main>
  );
}
