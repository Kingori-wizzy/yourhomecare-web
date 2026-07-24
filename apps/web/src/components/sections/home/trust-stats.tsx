import { Container } from "@/components/layout/container";
import { trustStats } from "@/content/trust";

export function TrustStats() {
  return (
    <section className="border-y bg-white py-12">
      <Container>
        <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
          {trustStats.map((item) => (
            <div key={item.label}>
              <h3 className="text-4xl font-bold text-primary">
                {item.value}
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}