import { PageHero } from "@/components/common/page-hero";

import { aboutContent } from "@/content/about";
import type { PageHero as PageHeroContent } from "@/server/cms";

interface AboutHeroProps {
  hero?: PageHeroContent;
}

export function AboutHero({ hero = aboutContent.hero }: AboutHeroProps) {
  return (
    <PageHero
      badge={hero.badge || "Trusted by 5,000+ families"}
      title={hero.title}
      description={hero.description}
      imageUrl={hero.imageUrl ?? "/images/about/story.jpg"}
      imageAlt="YourHomeCare team providing compassionate home healthcare"
      primaryCta={{ label: "Find Care", href: "/appointments" }}
      secondaryCta={{ label: "Our Services", href: "/services" }}
      priority
    />
  );
}
