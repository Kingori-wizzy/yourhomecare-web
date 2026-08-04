import { PageHero } from "@/components/common/page-hero";

import { contactContent } from "@/content/contact";
import type { PageHero as PageHeroContent } from "@/server/cms";

interface ContactHeroProps {
  hero?: PageHeroContent;
}

export function ContactHero({ hero = contactContent.hero }: ContactHeroProps) {
  return (
    <PageHero
      badge={hero.badge || "Contact Us"}
      title={hero.title}
      description={hero.description}
      imageUrl={hero.imageUrl ?? "/images/hero/professionals.jpg"}
      imageAlt="YourHomeCare care professionals ready to help"
      primaryCta={{ label: "Find Care", href: "/appointments" }}
      secondaryCta={{ label: "Our Services", href: "/services" }}
      priority
    />
  );
}
