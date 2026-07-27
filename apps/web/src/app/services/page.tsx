import { ServicesHero } from "@/components/sections/services/services-hero";
import { ServicesGrid } from "@/components/sections/services/services-grid";
import { WhyServices } from "@/components/sections/services/why-services";
import { CallToAction } from "@/components/sections/home/cta";

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