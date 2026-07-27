import { Partners } from "@/components/sections/home/partners";
import { CallToAction } from "@/components/sections/home/cta";
import { buildMetadata } from "@/lib/metadata";
import { getPageContent, getPublishedPartners, toPartnerCategories } from "@/server/cms";

export const metadata = buildMetadata({
  title: "Partners",
  description: "Meet the hospitals, medical insurers and healthcare organisations that partner with YourHomeCare.",
  path: "/partners",
});

export default async function PartnersPage() {
  const [content, partners] = await Promise.all([getPageContent("partners"), getPublishedPartners()]);

  return (
    <>
      <Partners hero={content.hero} categories={toPartnerCategories(partners)} />
      <CallToAction />
    </>
  );
}
