import type { Metadata } from "next";

import { ResourceManager } from "@/components/portal/resource-manager";
import { requirePortalAccess } from "@/lib/portal-guard";

export const metadata: Metadata = { title: "Assessments" };

export default async function AssessmentsPage() {
  await requirePortalAccess("assessments");

  return (
    <ResourceManager
      resource="assessments"
      title="Assessments"
      description="Review free assessment requests submitted from the website."
      fields={[
        { key: "fullName", label: "Full name", type: "text", required: true },
        { key: "email", label: "Email", type: "email", required: true },
        { key: "phone", label: "Phone", type: "text" },
        { key: "patientName", label: "Patient name", type: "text" },
        { key: "patientAge", label: "Patient age", type: "text", hideInTable: true },
        { key: "location", label: "Location", type: "text" },
        { key: "service", label: "Service", type: "text" },
        { key: "preferredDate", label: "Preferred date", type: "text", hideInTable: true },
        { key: "preferredTime", label: "Preferred time", type: "text", hideInTable: true },
        { key: "notes", label: "Notes", type: "textarea", hideInTable: true },
        {
          key: "status",
          label: "Status",
          type: "select",
          options: [
            { label: "New", value: "new" },
            { label: "In review", value: "in_review" },
            { label: "Scheduled", value: "scheduled" },
            { label: "Completed", value: "completed" },
            { label: "Cancelled", value: "cancelled" },
          ],
        },
      ]}
    />
  );
}
