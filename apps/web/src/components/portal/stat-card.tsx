import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  accentClassName,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accentClassName?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <span
          className={cn(
            "flex size-9 items-center justify-center rounded-lg bg-[#0F6CBD]/10 text-[#0F6CBD]",
            accentClassName
          )}
        >
          <Icon className="size-4.5" />
        </span>
      </div>
      <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

export function ProgressBar({ label, value, total }: { label: string; value: number; total: number }) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="text-slate-500">
          {value} ({percentage}%)
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-[#0F6CBD]" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
