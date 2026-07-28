import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { buildMetadata } from "@/lib/metadata";

import { BookingForm } from "@/components/sections/appointments/booking-form";

export const metadata = buildMetadata({
  title: "Book an Appointment",
  description: "Schedule a home healthcare appointment or assessment with YourHomeCare.",
  path: "/appointments",
});

export default function AppointmentsPage() {
  return (
    <Section className="bg-medical-soft">
      <Container>
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-semibold uppercase tracking-[0.2em] text-primary">Appointments</p>
          <h1 className="mt-4 text-4xl font-bold lg:text-5xl">Book a Home Healthcare Appointment</h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            Tell us about the patient and the care required. Choose a preferred date and time, and our
            care team will confirm your appointment shortly.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-4xl">
          <BookingForm />
        </div>
      </Container>
    </Section>
  );
}
