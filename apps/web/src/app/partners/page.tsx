import { PageHero } from "@/components/common/page-hero";
import { Partners } from "@/components/sections/home/partners";
import { CallToAction } from "@/components/sections/home/cta";
import { partnersContent } from "@/content/partners";
import { buildMetadata } from "@/lib/metadata";
import { getPageContent, getPublishedPartners, toPartnerCategories } from "@/server/cms";

export const metadata = buildMetadata({
  title: "Partners",
  description:
    "Meet the hospitals, medical insurers and healthcare organisations that partner with YourHomeCare.",
  path: "/partners",
});

export default async function PartnersPage() {
  const [content, partners] = await Promise.all([
    getPageContent("partners"),
    getPublishedPartners(),
  ]);

  const categories =
    partners.length > 0 ? toPartnerCategories(partners) : partnersContent.categories;

  return (
    <>
      <PageHero
        badge={content.hero.badge || "Trusted by 5,000+ families"}
        title={content.hero.title}
        description={content.hero.description}
        imageUrl="/images/flyers/insurers-partners.png"
        primaryCta={{ label: "Find Care", href: "/appointments" }}
        secondaryCta={{ label: "Our Services", href: "/services" }}
        priority
      />
      <Partners categories={categories} showIntro={false} />
      <CallToAction />
    </>
  );
}
