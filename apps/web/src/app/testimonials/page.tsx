import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Testimonials",
  description: "Read stories from patients, families and partners who trust YourHomeCare.",
  path: "/testimonials",
});

export default function TestimonialsPage() {
  return (
    <Section>
      <Container>
        <div className="mx-auto max-w-4xl rounded-3xl border bg-white p-10 shadow-sm">
          <p className="font-semibold uppercase tracking-[0.2em] text-primary">Testimonials</p>
          <h1 className="mt-4 text-4xl font-bold">Patient and family stories</h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            We are proud to support families, patients and healthcare partners with dependable home care services.
          </p>
        </div>
      </Container>
    </Section>
  );
}
