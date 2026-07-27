import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

export function LeadershipSection() {
  return (
    <Section>

      <Container>

        <div className="mx-auto max-w-3xl text-center">

          <p className="font-semibold uppercase tracking-widest text-primary">
            Leadership
          </p>

          <h2 className="mt-4 text-4xl font-bold">
            Experienced Healthcare Leadership
          </h2>

          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            YourHomeCare is guided by experienced healthcare and business
            professionals committed to improving healthcare delivery across Kenya.
          </p>

        </div>

        <div className="mx-auto mt-16 max-w-md rounded-3xl border bg-white p-8 text-center shadow-sm">

          <div className="mx-auto h-36 w-36 rounded-full bg-slate-200" />

          <h3 className="mt-6 text-2xl font-bold">
            Mark Mbure
          </h3>

          <p className="text-primary">
            Managing Director
          </p>

          <p className="mt-6 leading-8 text-muted-foreground">
            Providing strategic leadership and driving the vision of
            technology-enabled healthcare beyond hospital walls.
          </p>

        </div>

      </Container>

    </Section>
  );
}