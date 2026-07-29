import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

export function MapSection() {
  return (
    <Section className="bg-white">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
            Our Location
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-primary lg:text-5xl">
            Visit Our Office
          </h2>
          <p className="mt-4 text-lg leading-[1.6] text-muted-foreground">
            Our headquarters are based in Nairobi, Kenya. Contact us to arrange a visit or
            consultation.
          </p>
        </div>

        <div className="mt-14 overflow-hidden rounded-[8px] border border-border shadow-[var(--shadow-sm)]">
          <iframe
            title="Nairobi, Kenya"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d255281.6555459137!2d36.70730920392551!3d-1.302371700000045!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10d66a5a5a5a%3A0x0!2sNairobi%2C%20Kenya!5e0!3m2!1sen!2ske!4v1700000000000"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-[450px] w-full"
          />
        </div>
      </Container>
    </Section>
  );
}
