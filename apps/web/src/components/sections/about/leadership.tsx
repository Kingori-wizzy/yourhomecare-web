import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

export function LeadershipSection() {
  return (
    <Section className="bg-section">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
            Leadership
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-primary lg:text-5xl">
            Experienced Healthcare Leadership
          </h2>
          <p className="mt-4 text-lg leading-[1.6] text-muted-foreground">
            YourHomeCare is guided by experienced healthcare and business professionals
            committed to improving healthcare delivery across Kenya.
          </p>
        </div>

        <div className="mx-auto mt-14 max-w-md rounded-[8px] border border-border bg-white p-8 text-center shadow-[var(--shadow-sm)]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary/15 text-lg font-bold text-secondary">
            MM
          </div>
          <h3 className="mt-6 text-2xl font-bold text-primary">Mark Mbure</h3>
          <p className="mt-1 font-medium text-secondary">Managing Director</p>
          <p className="mt-5 text-base leading-[1.6] text-muted-foreground">
            Providing strategic leadership and driving the vision of technology-enabled
            healthcare beyond hospital walls.
          </p>
        </div>
      </Container>
    </Section>
  );
}
