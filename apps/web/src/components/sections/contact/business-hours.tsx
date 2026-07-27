import {
  Clock3,
  PhoneCall,
  CalendarDays,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { contactContent } from "@/content/contact";

interface BusinessHoursSectionProps {
  phone?: string;
}

const schedule = [
  {
    day: "Monday",
    hours: "8:00 AM - 5:00 PM",
  },
  {
    day: "Tuesday",
    hours: "8:00 AM - 5:00 PM",
  },
  {
    day: "Wednesday",
    hours: "8:00 AM - 5:00 PM",
  },
  {
    day: "Thursday",
    hours: "8:00 AM - 5:00 PM",
  },
  {
    day: "Friday",
    hours: "8:00 AM - 5:00 PM",
  },
  {
    day: "Saturday",
    hours: "9:00 AM - 1:00 PM",
  },
  {
    day: "Sunday",
    hours: "Emergency Support",
  },
];

export function BusinessHoursSection({ phone = contactContent.information.phone }: BusinessHoursSectionProps) {
  return (
    <Section className="bg-white">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-semibold uppercase tracking-[0.2em] text-primary">
            Business Hours
          </p>

          <h2 className="mt-4 text-4xl font-bold">
            We Are Here When You Need Us
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Our office is available during the following hours. Emergency
            support requests may still be accommodated outside normal office
            hours depending on clinical availability.
          </p>
        </div>

        <div className="mt-16 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {schedule.map((item) => (
            <div
              key={item.day}
              className="flex items-center justify-between border-b border-slate-100 px-8 py-5 last:border-b-0"
            >
              <div className="flex items-center gap-4">
                <CalendarDays
                  size={20}
                  className="text-primary"
                />

                <span className="font-semibold">
                  {item.day}
                </span>
              </div>

              <div className="flex items-center gap-3 text-slate-600">
                <Clock3
                  size={18}
                  className="text-primary"
                />

                <span>{item.hours}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-3xl bg-primary p-8 text-white">
          <div className="flex flex-col items-center justify-between gap-6 text-center lg:flex-row lg:text-left">
            <div className="flex items-center gap-4">
              <PhoneCall size={42} />

              <div>
                <h3 className="text-2xl font-semibold">
                  Need Immediate Assistance?
                </h3>

                <p className="mt-2 text-white/90">
                  Our care coordinators are available to discuss urgent
                  home healthcare needs.
                </p>
              </div>
            </div>

            <a
              href={`tel:${phone.replace(/[^+\d]/g, "")}`}
              className="rounded-xl bg-white px-8 py-4 font-semibold text-primary transition hover:bg-slate-100"
            >
              {phone}
            </a>
          </div>
        </div>
      </Container>
    </Section>
  );
}