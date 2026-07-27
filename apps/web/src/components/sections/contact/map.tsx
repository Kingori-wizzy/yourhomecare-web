import { MapPin } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

export function MapSection() {
  return (
    <Section className="bg-slate-50">

      <Container>

        <div className="text-center">

          <p className="font-semibold uppercase tracking-[0.2em] text-primary">
            Our Location
          </p>

          <h2 className="mt-4 text-4xl font-bold">
            Visit Our Office
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-600">
            Our headquarters are based in Nairobi, Kenya. Contact us to arrange
            a visit or consultation.
          </p>

        </div>

        <div className="mt-16 overflow-hidden rounded-3xl border shadow-sm">

          <div className="flex h-[450px] flex-col items-center justify-center bg-slate-200">

            <MapPin
              className="text-primary"
              size={56}
            />

            <h3 className="mt-6 text-2xl font-semibold">
              Google Maps
            </h3>

            <p className="mt-3 text-slate-600">
              Interactive map will be embedded here.
            </p>

          </div>

        </div>

      </Container>

    </Section>
  );
}