import type { Metadata } from "next";

import { ResourceManager } from "@/components/portal/resource-manager";
import { requirePortalAccess } from "@/lib/portal-guard";

export const metadata: Metadata = { title: "System logs" };

export default async function LogsPage() {
  await requirePortalAccess("logs");

  return (
    <ResourceManager
      resource="logs"
      title="System logs"
      description="Read-only audit trail of authentication and content changes."
      readOnly
      defaultSort="createdAt"
      emptyStateLabel="No activity has been recorded yet."
      fields={[
        { key: "action", label: "Action", type: "text" },
        { key: "userEmail", label: "User", type: "text" },
        { key: "resource", label: "Resource", type: "text" },
        { key: "resourceId", label: "Resource ID", type: "text" },
        { key: "createdAt", label: "When", type: "text" },
      ]}
    />
  );
}
