import type { Metadata } from "next";

import { ResourceManager } from "@/components/portal/resource-manager";
import { requirePortalAccess } from "@/lib/portal-guard";

export const metadata: Metadata = { title: "Patients" };

export default async function PatientsPage() {
  await requirePortalAccess("patients");

  return (
    <ResourceManager
      resource="patients"
      title="Patients"
      description="Manage patient records, care plans and contact details."
      fields={[
        { key: "fullName", label: "Full name", type: "text", required: true },
        { key: "email", label: "Email", type: "email" },
        { key: "phone", label: "Phone", type: "text" },
        { key: "address", label: "Address", type: "text" },
        { key: "carePlan", label: "Care plan", type: "textarea" },
        { key: "notes", label: "Notes", type: "textarea", hideInTable: true },
        {
          key: "status",
          label: "Status",
          type: "select",
          options: [
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
            { label: "Discharged", value: "discharged" },
          ],
        },
      ]}
    />
  );
}
