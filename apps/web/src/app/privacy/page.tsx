import { PageHero } from "@/components/common/page-hero";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { CallToAction } from "@/components/sections/home/cta";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/config/site";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description: "Learn how YourHomeCare collects, uses and protects your personal and health information.",
  path: "/privacy",
});

const sections = [
  {
    title: "1. Introduction",
    body: `${siteConfig.name} ("we", "us" or "our") is committed to protecting the privacy and confidentiality of every patient, family member, partner and website visitor we serve. This Privacy Policy explains how we collect, use, disclose and safeguard information when you use our website, request an assessment, submit a referral or otherwise interact with our home healthcare services.`,
  },
  {
    title: "2. Information We Collect",
    body: "We may collect personal details such as your name, phone number, email address, physical address, and, where relevant to arranging care, sensitive health information about you or the patient you are enquiring on behalf of. We also collect limited technical information (such as browser type and device information) automatically when you visit our website.",
  },
  {
    title: "3. How We Use Your Information",
    body: "Information you provide is used to respond to assessment and referral requests, coordinate and deliver healthcare services, communicate with you about your care, process job applications, send newsletters you have subscribed to, and improve our website and services. We do not sell your personal information to third parties.",
  },
  {
    title: "4. Sharing of Information",
    body: "We may share information with healthcare professionals, hospitals, medical insurers and technology partners (such as our TaskEase care coordination platform) strictly for the purpose of delivering and coordinating your care. We may also disclose information where required by law or to protect the safety of a patient or the public.",
  },
  {
    title: "5. Data Security",
    body: "We maintain administrative, technical and physical safeguards designed to protect personal and health information from unauthorised access, alteration, disclosure or destruction, including secure record management and controlled staff access to sensitive data.",
  },
  {
    title: "6. Your Rights",
    body: "You may request access to, correction of, or deletion of your personal information, subject to our clinical and legal record-keeping obligations. To make a request, please contact us using the details below.",
  },
  {
    title: "7. Cookies",
    body: "Our website may use cookies and similar technologies to improve functionality and understand how visitors use our site. You can control cookies through your browser settings.",
  },
  {
    title: "8. Changes to This Policy",
    body: "We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.",
  },
  {
    title: "9. Contact Us",
    body: `If you have questions about this Privacy Policy or how we handle your information, please contact us at ${siteConfig.email} or ${siteConfig.phone}.`,
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        badge="Trusted by 5,000+ families"
        title="Privacy Policy"
        description="How YourHomeCare collects, uses and protects your personal and health information."
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
