import { PageHero } from "@/components/common/page-hero";

import { solutionsContent } from "@/content/solutions";
import type { PageHero as PageHeroContent } from "@/server/cms";

interface SolutionHeroProps {
  hero?: PageHeroContent;
}

export function SolutionHero({ hero = solutionsContent.hero }: SolutionHeroProps) {
  return (
    <PageHero
      badge={hero.badge || "Healthcare Solutions"}
      title={hero.title}
      description={hero.description}
      imageUrl={hero.imageUrl ?? "/images/flyers/insurers-partners.png"}
      imageAlt="Healthcare solutions for partners and families"
      primaryCta={{ label: "Find Care", href: "/appointments" }}
      secondaryCta={{ label: "Our Services", href: "/services" }}
      priority
    />
  );
}
