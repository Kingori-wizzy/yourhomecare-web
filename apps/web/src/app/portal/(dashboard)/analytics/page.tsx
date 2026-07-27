import type { Metadata } from "next";
import {
  BarChart3,
  Briefcase,
  CalendarClock,
  ClipboardCheck,
  Handshake,
  HeartHandshake,
  ImageIcon,
  Mail,
  MessageSquare,
  Newspaper,
  Quote,
  Share2,
} from "lucide-react";

import { requirePortalAccess } from "@/lib/portal-guard";
import { getDashboardMetrics } from "@/server/services";
import { StatCard, ProgressBar } from "@/components/portal/stat-card";

export const metadata: Metadata = { title: "Analytics" };

const CONTENT_METRICS = ["blogPosts", "partners", "testimonials", "media"] as const;
const OPERATIONS_METRICS = ["patients", "appointments", "assessments", "referrals", "contacts"] as const;
const GROWTH_METRICS = ["careers", "jobs", "newsletters"] as const;

const ICONS: Record<string, typeof HeartHandshake> = {
  patients: HeartHandshake,
  appointments: CalendarClock,
  assessments: ClipboardCheck,
  referrals: Share2,
  contacts: MessageSquare,
  careers: Briefcase,
  jobs: Briefcase,
  newsletters: Mail,
  blogPosts: Newspaper,
  partners: Handshake,
  testimonials: Quote,
  media: ImageIcon,
};

const LABELS: Record<string, string> = {
  patients: "Patients",
  appointments: "Appointments",
  assessments: "Assessments",
  referrals: "Referrals",
  contacts: "Contacts",
  careers: "Career applications",
  jobs: "Open jobs",
  newsletters: "Newsletter subscribers",
  blogPosts: "Blog posts",
  partners: "Partners",
  testimonials: "Testimonials",
  media: "Media assets",
};

export default async function AnalyticsPage() {
  await requirePortalAccess("analytics");
  const metrics = await getDashboardMetrics();
  const record = metrics as unknown as Record<string, number>;

  const total = Object.values(record).reduce((sum, value) => sum + value, 0);
  const maxOperations = Math.max(...OPERATIONS_METRICS.map((key) => record[key]), 1);
  const maxContent = Math.max(...CONTENT_METRICS.map((key) => record[key]), 1);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Analytics</h2>
        <p className="mt-1 text-sm text-slate-500">
          A snapshot of engagement and operational volume across YourHomeCare.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total records" value={total} icon={BarChart3} />
        {GROWTH_METRICS.map((key) => (
          <StatCard key={key} label={LABELS[key]} value={record[key]} icon={ICONS[key]} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="mb-4 font-semibold text-slate-900">Care operations volume</h3>
          <div className="flex flex-col gap-4">
            {OPERATIONS_METRICS.map((key) => (
              <ProgressBar key={key} label={LABELS[key]} value={record[key]} total={maxOperations} />
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="mb-4 font-semibold text-slate-900">Content &amp; marketing volume</h3>
          <div className="flex flex-col gap-4">
            {CONTENT_METRICS.map((key) => (
              <ProgressBar key={key} label={LABELS[key]} value={record[key]} total={maxContent} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
