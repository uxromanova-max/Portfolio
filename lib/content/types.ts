export type NavItem = {
  label: string;
  href: string;
};

export type HeroContent = {
  eyebrowKicker: string;
  headlineLines: string[];
  headlineSupportingLine: string;
  subheadline: string;
  signatureName: string;
  ctaLabel: string;
  ctaHref: string;
  photo: string;
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
