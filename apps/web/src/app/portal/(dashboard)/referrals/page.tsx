import type { Metadata } from "next";

import { ResourceManager } from "@/components/portal/resource-manager";
import { requirePortalAccess } from "@/lib/portal-guard";

export const metadata: Metadata = { title: "Referrals" };

export default async function ReferralsPage() {
  await requirePortalAccess("referrals");

  return (
    <ResourceManager
      resource="referrals"
      title="Referrals"
      description="Manage professional and hospital referrals for patient care."
      fields={[
        { key: "organization", label: "Organization", type: "text", required: true },
        { key: "contactName", label: "Contact name", type: "text", required: true },
        { key: "email", label: "Email", type: "email", required: true },
        { key: "phone", label: "Phone", type: "text" },
        { key: "patientName", label: "Patient name", type: "text" },
        { key: "diagnosis", label: "Diagnosis", type: "textarea", hideInTable: true },
        { key: "service", label: "Service", type: "text" },
        { key: "location", label: "Location", type: "text", hideInTable: true },
        { key: "notes", label: "Notes", type: "textarea", hideInTable: true },
        {
          key: "status",
          label: "Status",
          type: "select",
          options: [
            { label: "New", value: "new" },
            { label: "Reviewed", value: "reviewed" },
            { label: "Accepted", value: "accepted" },
            { label: "Declined", value: "declined" },
          ],
        },
      ]}
    />
  );
}
