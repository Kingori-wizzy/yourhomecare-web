import type { Metadata } from "next";

import { ResourceManager } from "@/components/portal/resource-manager";
import { requirePortalAccess } from "@/lib/portal-guard";

export const metadata: Metadata = { title: "Team Management" };

export default async function TeamManagementPage() {
  await requirePortalAccess("team");

  return (
    <ResourceManager
      resource="team"
      title="Team Management"
      description="Manage leadership and team profiles shown on the Meet the Team section."
      fields={[
        { key: "fullName", label: "Full name", type: "text", required: true },
        { key: "title", label: "Job title", type: "text", required: true },
        { key: "rank", label: "Role / rank", type: "text" },
        { key: "department", label: "Department", type: "text" },
        { key: "biography", label: "Biography", type: "textarea", hideInTable: true },
        { key: "photoUrl", label: "Photo URL", type: "url", hideInTable: true },
        { key: "displayOrder", label: "Display order", type: "number" },
        { key: "isActive", label: "Active", type: "boolean" },
      ]}
    />
  );
}
