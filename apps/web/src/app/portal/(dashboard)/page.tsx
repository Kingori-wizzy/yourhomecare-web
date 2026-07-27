import type { Metadata } from "next";
import Link from "next/link";
import {
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
import { listMemoryAuditLogs } from "@/server/auth-store";
import { StatCard } from "@/components/portal/stat-card";

export const metadata: Metadata = { title: "Dashboard" };

const METRIC_META: Record<
  string,
  { label: string; icon: typeof HeartHandshake; href: string }
> = {
  patients: { label: "Patients", icon: HeartHandshake, href: "/portal/patients" },
  appointments: { label: "Appointments", icon: CalendarClock, href: "/portal/appointments" },
  assessments: { label: "Assessments", icon: ClipboardCheck, href: "/portal/assessments" },
  referrals: { label: "Referrals", icon: Share2, href: "/portal/referrals" },
  contacts: { label: "Contacts", icon: MessageSquare, href: "/portal/contacts" },
  careers: { label: "Career applications", icon: Briefcase, href: "/portal/careers" },
  jobs: { label: "Open jobs", icon: Briefcase, href: "/portal/jobs" },
  newsletters: { label: "Newsletter subscribers", icon: Mail, href: "/portal/newsletters" },
  blogPosts: { label: "Blog posts", icon: Newspaper, href: "/portal/blog" },
  partners: { label: "Partners", icon: Handshake, href: "/portal/partners" },
  testimonials: { label: "Testimonials", icon: Quote, href: "/portal/testimonials" },
  media: { label: "Media assets", icon: ImageIcon, href: "/portal/media" },
};

function formatRelativeTime(iso: string) {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.round(diffMs / 60000);
  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.round(diffHours / 24);
  return `${diffDays}d ago`;
}

export default async function PortalDashboardPage() {
  const session = await requirePortalAccess("dashboard");
  const metrics = await getDashboardMetrics();
  const recentActivity = listMemoryAuditLogs().slice(0, 8) as Array<{
    id: string;
    action: string;
    userEmail?: string | null;
    resource?: string | null;
    createdAt: string;
  }>;

  const firstName = session?.user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Welcome back, {firstName} 👋</h2>
        <p className="mt-1 text-sm text-slate-500">
          Here&rsquo;s what&rsquo;s happening across YourHomeCare today.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
        {Object.entries(metrics).map(([key, value]) => {
          const meta = METRIC_META[key];
          if (!meta) return null;
          const Icon = meta.icon;

          return (
            <Link key={key} href={meta.href}>
              <StatCard label={meta.label} value={value} icon={Icon} />
            </Link>
          );
        })}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="font-semibold text-slate-900">Recent activity</h3>
        </div>
        {recentActivity.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-slate-400">No recent activity yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {recentActivity.map((entry) => (
              <li key={entry.id} className="flex items-center justify-between gap-4 px-5 py-3 text-sm">
                <div>
                  <p className="font-medium text-slate-800">
                    {entry.action.replaceAll("_", " ")}
                    {entry.resource ? ` · ${entry.resource}` : ""}
                  </p>
                  <p className="text-slate-500">{entry.userEmail ?? "System"}</p>
                </div>
                <span className="shrink-0 text-xs text-slate-400">{formatRelativeTime(entry.createdAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
