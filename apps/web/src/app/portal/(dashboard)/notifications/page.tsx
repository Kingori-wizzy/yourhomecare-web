import type { Metadata } from "next";

import { ResourceManager } from "@/components/portal/resource-manager";
import { requirePortalAccess } from "@/lib/portal-guard";

export const metadata: Metadata = { title: "Notifications" };

export default async function NotificationsPage() {
  await requirePortalAccess("notifications");

  return (
    <ResourceManager
      resource="notifications"
      title="Notifications"
      description="Create and manage internal notifications for the care team."
      fields={[
        { key: "title", label: "Title", type: "text", required: true },
        { key: "message", label: "Message", type: "textarea", required: true, hideInTable: true },
        {
          key: "type",
          label: "Type",
          type: "select",
          options: [
            { label: "Info", value: "info" },
            { label: "Success", value: "success" },
            { label: "Warning", value: "warning" },
            { label: "Error", value: "error" },
          ],
        },
        { key: "read", label: "Read", type: "boolean" },
      ]}
    />
  );
}
