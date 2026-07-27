import type { Metadata } from "next";

import { requirePortalAccess } from "@/lib/portal-guard";
import {
  appointmentService,
  assessmentService,
  careersService,
  contactService,
  referralService,
} from "@/server/services";
import { ProgressBar } from "@/components/portal/stat-card";

export const metadata: Metadata = { title: "Reports" };

function groupByStatus(items: Array<{ status?: string }>) {
  const counts: Record<string, number> = {};
  for (const item of items) {
    const status = item.status ?? "unknown";
    counts[status] = (counts[status] ?? 0) + 1;
  }
  return counts;
}

function ReportCard({ title, counts }: { title: string; counts: Record<string, number> }) {
  const total = Object.values(counts).reduce((sum, value) => sum + value, 0);
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">{title}</h3>
        <span className="text-sm text-slate-500">{total} total</span>
      </div>
      {entries.length === 0 ? (
        <p className="text-sm text-slate-400">No records yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {entries.map(([status, value]) => (
            <ProgressBar
              key={status}
              label={status.replaceAll("_", " ")}
              value={value}
              total={total}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default async function ReportsPage() {
  await requirePortalAccess("reports");

  const [appointments, assessments, referrals, contacts, careers] = await Promise.all([
    appointmentService.list(),
    assessmentService.list(),
    referralService.list(),
    contactService.list(),
    careersService.list(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Operational reports</h2>
        <p className="mt-1 text-sm text-slate-500">
          Status breakdowns across the key care coordination and recruitment pipelines.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ReportCard title="Appointments by status" counts={groupByStatus(appointments)} />
        <ReportCard title="Assessment requests by status" counts={groupByStatus(assessments)} />
        <ReportCard title="Referrals by status" counts={groupByStatus(referrals)} />
        <ReportCard title="Contact enquiries by status" counts={groupByStatus(contacts)} />
        <ReportCard title="Career applications by status" counts={groupByStatus(careers)} />
      </div>
    </div>
  );
}
