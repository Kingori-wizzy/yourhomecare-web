import type { Metadata } from "next";

import { ResourceManager } from "@/components/portal/resource-manager";
import { requirePortalAccess } from "@/lib/portal-guard";

export const metadata: Metadata = { title: "Appointments" };

export default async function AppointmentsPage() {
  await requirePortalAccess("appointments");

  return (
    <ResourceManager
      resource="appointments"
      title="Appointments"
      description="Track scheduled, completed and cancelled patient appointments."
      fields={[
        { key: "title", label: "Title", type: "text", required: true },
        { key: "patientId", label: "Patient ID", type: "text" },
        {
          key: "scheduledAt",
          label: "Scheduled at",
          type: "text",
          required: true,
          placeholder: "2026-08-01T09:00",
          helperText: "Use ISO date-time format, e.g. 2026-08-01T09:00",
        },
        {
          key: "status",
          label: "Status",
          type: "select",
          options: [
            { label: "Scheduled", value: "scheduled" },
            { label: "Completed", value: "completed" },
            { label: "Cancelled", value: "cancelled" },
            { label: "Rescheduled", value: "rescheduled" },
          ],
        },
        { key: "notes", label: "Notes", type: "textarea", hideInTable: true },
      ]}
    />
  );
}
