import { ServicesHero } from "@/components/sections/services/services-hero";
import { ServicesGrid } from "@/components/sections/services/services-grid";
import { WhyServices } from "@/components/sections/services/why-services";
import { CallToAction } from "@/components/sections/home/cta";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Services",
  description: "Explore home nursing, palliative care, caregiver support, rehabilitation and coordinated healthcare services.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServicesGrid />
      <WhyServices />
      <CallToAction />
    </>
  );
}