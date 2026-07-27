import { TechnologyHero } from "@/components/sections/technology/hero";
import { TechnologyOverview } from "@/components/sections/technology/overview";
import { TechnologyFeatures } from "@/components/sections/technology/features";
import { TechnologyBenefits } from "@/components/sections/technology/benefits";
import { CallToAction } from "@/components/sections/home/cta";

export default function TechnologyPage() {
  return (
    <>
      <TechnologyHero />
      <TechnologyOverview />
      <TechnologyFeatures />
      <TechnologyBenefits />
      <CallToAction />
    </>
  );
}