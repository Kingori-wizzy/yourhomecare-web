import { AlertTriangle } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { contactContent } from "@/content/contact";

interface EmergencySectionProps {
  message?: string;
}

export function EmergencySection({ message = contactContent.emergency }: EmergencySectionProps) {
  return (
    <Section className="bg-red-50">

      <Container>

        <div className="rounded-3xl border border-red-200 bg-white p-12">

          <div className="flex flex-col items-center text-center">

            <AlertTriangle
              className="text-red-600"
              size={52}
            />

            <h2 className="mt-6 text-3xl font-bold text-red-700">
              Medical Emergency?
            </h2>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">
              {message}
            </p>

            <p className="mt-4 max-w-3xl text-slate-600">
              Our team can assist with arranging home healthcare after hospital
              discharge and support your continued recovery.
            </p>

          </div>

        </div>

      </Container>

    </Section>
  );
}