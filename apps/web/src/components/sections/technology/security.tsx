import {
  CheckCircle2,
  Lock,
  ShieldCheck,
  Database,
  Fingerprint,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

import { technologyContent } from "@/content/technology";

export function TechnologySecurity() {
  return (
    <Section className="bg-slate-50">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-semibold uppercase tracking-widest text-primary">
            Security & Compliance
          </p>

          <h2 className="mt-4 text-4xl font-bold lg:text-5xl">
            Protecting Every Patient&apos;s Information
          </h2>

          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Healthcare information deserves the highest level of protection.
            TaskEase is designed to promote secure documentation,
            accountability and trusted collaboration across the care journey.
          </p>
        </div>

        <div className="mt-16 grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            {technologyContent.security.map((item) => (
              <div
                key={item}
                className="flex items-center gap-4 rounded-2xl border bg-white p-5 shadow-sm"
              >
                <CheckCircle2
                  size={22}
                  className="text-primary"
                />

                <span className="font-medium">
                  {item}
                </span>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-lg">
            <div className="grid gap-8">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-primary/10 p-4 text-primary">
                  <Lock size={28} />
                </div>

                <div>
                  <h3 className="font-semibold">
                    Secure Access
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    Controlled user permissions and secure authentication.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-primary/10 p-4 text-primary">
                  <Database size={28} />
                </div>

                <div>
                  <h3 className="font-semibold">
                    Protected Clinical Records
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    Patient documentation remains organised and securely managed.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-primary/10 p-4 text-primary">
                  <Fingerprint size={28} />
                </div>

                <div>
                  <h3 className="font-semibold">
                    Audit Trails
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    Every activity is traceable, improving accountability.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-primary/10 p-4 text-primary">
                  <ShieldCheck size={28} />
                </div>

                <div>
                  <h3 className="font-semibold">
                    Trusted Collaboration
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    Secure communication between clinicians, hospitals,
                    insurers and families.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}