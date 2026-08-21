export type NavItem = {
  label: string;
  href: string;
};

export type TextSegment = {
  text: string;
  highlight?: boolean;
};

export type HeroContent = {
  eyebrowKicker: string;
  headlineLines: string[];
  headlineSupportingLine: TextSegment[];
  subheadline: string;
  signatureName: string;
  ctaLabel: string;
  ctaHref: string;
  photo: {
    desktop: string;
    desktopAfter: string;
    mobile: string;
  };
};

export type SiteContent = {
  meta: {
    variant: string;
    variantLabel: string;
    name: string;
    pageTitle: string;
  };
  nav: NavItem[];
  hero: HeroContent;
};
