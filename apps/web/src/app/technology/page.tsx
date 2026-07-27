import { TechnologyHero } from "@/components/sections/technology/hero";
import { TechnologyOverview } from "@/components/sections/technology/overview";
import { TechnologyFeatures } from "@/components/sections/technology/features";
import { TechnologyBenefits } from "@/components/sections/technology/benefits";
import { TechnologySecurity } from "@/components/sections/technology/security";
import { TechnologyCTA } from "@/components/sections/technology/cta";
import { buildMetadata } from "@/lib/metadata";
import { getPageContent } from "@/server/cms";

export const metadata = buildMetadata({
  title: "Technology",
  description: "Discover TaskEase, our digital care coordination platform powering secure, connected home healthcare.",
  path: "/technology",
});

export default async function TechnologyPage() {
  const content = await getPageContent("technology");

  return (
    <>
      <TechnologyHero hero={content.hero} />
      <TechnologyOverview introduction={content.introduction} />
      <TechnologyFeatures features={content.features} />
      <TechnologyBenefits benefits={content.benefits} />
      <TechnologySecurity security={content.security} />
      <TechnologyCTA />
    </>
  );
}
