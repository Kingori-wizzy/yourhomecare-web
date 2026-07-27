import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Book an Assessment",
  description: "Schedule a home healthcare assessment with YourHomeCare.",
  path: "/appointments",
});

export default function AppointmentsPage() {
  return (
    <Section className="bg-slate-50">
      <Container>
        <div className="mx-auto max-w-4xl rounded-3xl border bg-white p-10 shadow-sm">
          <p className="font-semibold uppercase tracking-[0.2em] text-primary">Appointments</p>
          <h1 className="mt-4 text-4xl font-bold">Book a Home Care Assessment</h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Use our contact and assessment forms to request a professional evaluation for home healthcare support.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/contact#assessment">
              <Button>Request Assessment</Button>
            </Link>
            <Link href="/contact#referral">
              <Button variant="outline">Refer a Patient</Button>
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
