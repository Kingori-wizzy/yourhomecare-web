import { PageHero } from "@/components/common/page-hero";

import { servicesContent } from "@/content/services";
import type { PageHero as PageHeroContent } from "@/server/cms";

interface ServicesHeroProps {
  hero?: PageHeroContent;
}

export function ServicesHero({ hero = servicesContent.hero }: ServicesHeroProps) {
  return (
    <PageHero
      badge={hero.badge || "Trusted by 5,000+ families"}
      title={hero.title}
      description={hero.description}
      imageUrl={hero.imageUrl ?? "/images/services/nursing.jpg"}
      imageAlt="Home nursing and personal care with YourHomeCare"
      primaryCta={{ label: "Find Care", href: "/appointments" }}
      secondaryCta={{ label: "Our Services", href: "/services" }}
      priority
    />
  );
}
