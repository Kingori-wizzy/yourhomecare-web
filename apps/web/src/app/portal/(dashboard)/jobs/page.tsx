import type { Metadata } from "next";

import { ResourceManager } from "@/components/portal/resource-manager";
import { requirePortalAccess } from "@/lib/portal-guard";

export const metadata: Metadata = { title: "Jobs" };

export default async function JobsPage() {
  await requirePortalAccess("jobs");

  return (
    <ResourceManager
      resource="jobs"
      title="Job listings"
      description="Publish and manage open roles shown on the careers page."
      fields={[
        { key: "title", label: "Title", type: "text", required: true },
        { key: "department", label: "Department", type: "text" },
        { key: "location", label: "Location", type: "text" },
        { key: "employmentType", label: "Employment type", type: "text" },
        { key: "description", label: "Description", type: "textarea", hideInTable: true, required: true },
        {
          key: "requirements",
          label: "Requirements",
          type: "text",
          isList: true,
          hideInTable: true,
          helperText: "Comma-separated list of requirements.",
        },
        { key: "isOpen", label: "Open", type: "boolean" },
        { key: "displayOrder", label: "Display order", type: "number", hideInTable: true },
      ]}
    />
  );
}
