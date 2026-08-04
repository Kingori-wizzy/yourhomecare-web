import { PageHero } from "@/components/common/page-hero";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { BookingForm } from "@/components/sections/appointments/booking-form";
import { CallToAction } from "@/components/sections/home/cta";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Book an Appointment",
  description: "Schedule a home healthcare appointment or assessment with YourHomeCare.",
  path: "/appointments",
});

export default function AppointmentsPage() {
  return (
    <>
      <PageHero
        badge="Book Assessment"
        title="Book a Home Healthcare Appointment"
        description="Tell us about the patient and the care required. Choose a preferred date and time, and our care team will confirm your appointment shortly."
        imageUrl="/images/hero/professionals.jpg"
        primaryCta={{ label: "Find Care", href: "/appointments" }}
        secondaryCta={{ label: "Our Services", href: "/services" }}
        priority
      />

      <Section className="bg-section">
        <Container>
          <div className="mx-auto max-w-4xl">
            <BookingForm />
          </div>
        </Container>
      </Section>

      <CallToAction />
    </>
  );
}
