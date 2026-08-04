import { PageHero } from "@/components/common/page-hero";

import { technologyContent } from "@/content/technology";
import type { PageHero as PageHeroContent } from "@/server/cms";

interface TechnologyHeroProps {
  hero?: PageHeroContent;
}

export function TechnologyHero({ hero = technologyContent.hero }: TechnologyHeroProps) {
  return (
    <PageHero
      badge={hero.badge || "Technology"}
      title={hero.title}
      description={hero.description}
      imageUrl={hero.imageUrl ?? "/images/hero/insurers.jpg"}
      imageAlt="Technology-enabled care coordination with TaskEase"
      primaryCta={{ label: "Find Care", href: "/appointments" }}
      secondaryCta={{ label: "Our Services", href: "/services" }}
      priority
    />
  );
}
