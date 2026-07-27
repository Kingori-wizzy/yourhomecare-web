import { ContactHero } from "@/components/sections/contact/hero";
import { ContactInfo } from "@/components/sections/contact/contact-info";
import { AssessmentSection } from "@/components/sections/contact/assessment";
import { ReferralSection } from "@/components/sections/contact/referral";
import { ContactFormSection } from "@/components/sections/contact/contact-form";
import { BusinessHoursSection } from "@/components/sections/contact/business-hours";
import { MapSection } from "@/components/sections/contact/map";
import { EmergencySection } from "@/components/sections/contact/emergency";
import { ContactCTA } from "@/components/sections/contact/cta";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Contact Us",
  description: "Get in touch with YourHomeCare for assessments, referrals, home care support and general enquiries.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <ContactHero />

      <ContactInfo />

      <AssessmentSection />

      <ReferralSection />

      <ContactFormSection />

      <BusinessHoursSection />

      <MapSection />

      <EmergencySection />

      <ContactCTA />
    </>
  );
}