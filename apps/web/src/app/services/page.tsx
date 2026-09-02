import { ServicesHero } from "@/components/sections/services/services-hero";
import { ServicesGrid } from "@/components/sections/services/services-grid";
import { WhyServices } from "@/components/sections/services/why-services";
import { CallToAction } from "@/components/sections/home/cta";
import { buildMetadata } from "@/lib/metadata";
import { getPageContent, getPublishedServices, toServiceItems } from "@/server/cms";

export const metadata = buildMetadata({
  title: "Services",
  description: "Explore home nursing, palliative care, caregiver support, rehabilitation and coordinated healthcare services.",
  path: "/services",
});

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const [content, services] = await Promise.all([getPageContent("services"), getPublishedServices()]);

  return (
    <>
      <ServicesHero hero={content.hero} />
      <ServicesGrid services={toServiceItems(services)} />
      <WhyServices />
      <CallToAction />
    </>
  );
}
