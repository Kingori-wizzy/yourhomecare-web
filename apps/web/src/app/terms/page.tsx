import { PageHero } from "@/components/common/page-hero";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { CallToAction } from "@/components/sections/home/cta";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/config/site";

export const metadata = buildMetadata({
  title: "Terms of Service",
  description: "Read the terms and conditions governing the use of YourHomeCare services and website.",
  path: "/terms",
});

const sections = [
  {
    title: "1. Acceptance of Terms",
    body: `By accessing this website or engaging ${siteConfig.name} for home healthcare services, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our website or services.`,
  },
  {
    title: "2. Our Services",
    body: "We provide home nursing, palliative care, elderly care, caregiver services, rehabilitation support, post-hospital recovery, care coordination and healthcare staffing services. Specific services are agreed upon following a clinical assessment and are subject to availability and clinical appropriateness.",
  },
  {
    title: "3. Assessments and Referrals",
    body: "Submitting an assessment request, referral or enquiry through this website does not guarantee acceptance of care. All care arrangements are confirmed following a clinical review by our care coordination team.",
  },
  {
    title: "4. Medical Disclaimer",
    body: "Content on this website is provided for general informational purposes only and does not constitute medical advice. Always seek the guidance of a qualified healthcare professional regarding any medical condition. In an emergency, contact your nearest emergency services or hospital immediately.",
  },
  {
    title: "5. Fees and Payment",
    body: "Fees for services are communicated and agreed upon during the assessment and onboarding process, and may vary depending on the level of care required, duration and any applicable insurance or payer arrangements.",
  },
  {
    title: "6. Confidentiality",
    body: "We handle all patient and client information with strict confidentiality in accordance with our Privacy Policy and applicable healthcare data protection standards.",
  },
  {
    title: "7. Limitation of Liability",
    body: `To the fullest extent permitted by law, ${siteConfig.name} shall not be liable for any indirect, incidental or consequential damages arising from the use of this website or our services, except where such liability cannot be excluded by law.`,
  },
  {
    title: "8. Intellectual Property",
    body: "All content on this website, including text, graphics, logos and the TaskEase platform, is the property of YourHomeCare or its licensors and may not be reproduced without prior written consent.",
  },
  {
    title: "9. Changes to These Terms",
    body: "We may revise these Terms of Service from time to time. Continued use of our website or services after changes are posted constitutes acceptance of the updated terms.",
  },
  {
    title: "10. Contact Us",
    body: `For questions about these Terms of Service, please contact us at ${siteConfig.email} or ${siteConfig.phone}.`,
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHero
        badge="Trusted by 5,000+ families"
        title="Terms of Service"
        description="The terms and conditions governing the use of YourHomeCare services and website."
        primaryCta={{ label: "Find Care", href: "/appointments" }}
        secondaryCta={{ label: "Our Services", href: "/services" }}
      />

      <Section className="bg-white">
        <Container>
          <div className="mx-auto max-w-3xl">
            <p className="text-sm text-muted-foreground">Last updated: January 2026</p>

            <div className="mt-10 space-y-6">
              {sections.map((section, index) => (
                <div
                  key={section.title}
                  className={`rounded-[8px] border border-border p-6 shadow-[var(--shadow-sm)] ${
                    index % 2 === 0 ? "bg-[#f8f9ff]" : "bg-white"
                  }`}
                >
                  <h2 className="text-2xl font-bold text-primary">{section.title}</h2>
                  <p className="mt-4 leading-[1.6] text-muted-foreground">{section.body}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <CallToAction />
    </>
  );
}
