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
    <Section className="bg-section">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
            Business Hours
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-primary lg:text-5xl">
            We Are Here When You Need Us
          </h2>
          <p className="mt-4 text-lg leading-[1.6] text-muted-foreground">
            Our office is available during the following hours. Emergency support requests may still
            be accommodated outside normal office hours depending on clinical availability.
          </p>
        </div>

        <div className="mt-14 overflow-hidden rounded-[8px] border border-border bg-white shadow-[var(--shadow-sm)]">
          {schedule.map((item) => (
            <div
              key={item.day}
              className="flex items-center justify-between border-b border-border px-6 py-5 last:border-b-0 sm:px-8"
            >
              <div className="flex items-center gap-4">
                <CalendarDays size={20} className="text-secondary" />
                <span className="font-semibold text-primary">{item.day}</span>
              </div>

              <div className="flex items-center gap-3 text-muted-foreground">
                <Clock3 size={18} className="text-secondary" />
                <span>{item.hours}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-[8px] bg-gradient-to-br from-secondary via-[#0a6b6b] to-primary p-8 text-white shadow-[var(--shadow-sm)]">
          <div className="flex flex-col items-center justify-between gap-6 text-center lg:flex-row lg:text-left">
            <div className="flex flex-col items-center gap-4 lg:flex-row">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/15 text-white">
                <PhoneCall size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Need Immediate Assistance?</h3>
                <p className="mt-2 leading-[1.6] text-white/90">
                  Our care coordinators are available to discuss urgent home healthcare needs.
                </p>
              </div>
            </div>

            <a
              href={`tel:${phone.replace(/[^+\d]/g, "")}`}
              className="inline-flex h-12 items-center justify-center rounded-[8px] bg-white px-8 font-semibold text-primary transition hover:bg-white/90"
            >
              {phone}
            </a>
          </div>
        </div>
      </Container>
    </Section>
  );
}
