import { AboutHero } from "@/components/sections/about/about-hero";
import { CompanyStory } from "@/components/sections/about/company-story";
import { MissionSection } from "@/components/sections/about/mission";
import { ApproachSection } from "@/components/sections/about/approach";
import { ImpactSection } from "@/components/sections/about/impact";
import { LeadershipSection } from "@/components/sections/about/leadership";
import { CallToAction } from "@/components/sections/home/cta";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "About Us",
  description: "Learn about YourHomeCare’s story, mission, values and healthcare philosophy.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <CompanyStory />
      <MissionSection />
      <ApproachSection />
      <ImpactSection />
      <LeadershipSection />
      <CallToAction />
    </>
  );
}