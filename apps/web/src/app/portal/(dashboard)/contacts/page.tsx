import type { Metadata } from "next";

import { ResourceManager } from "@/components/portal/resource-manager";
import { requirePortalAccess } from "@/lib/portal-guard";

export const metadata: Metadata = { title: "Contacts" };

export default async function ContactsPage() {
  await requirePortalAccess("contacts");

  return (
    <ResourceManager
      resource="contacts"
      title="Contacts"
      description="General enquiries submitted through the website contact form."
      fields={[
        { key: "fullName", label: "Full name", type: "text", required: true },
        { key: "email", label: "Email", type: "email", required: true },
        { key: "phone", label: "Phone", type: "text" },
        { key: "category", label: "Category", type: "text" },
        { key: "subject", label: "Subject", type: "text", required: true },
        { key: "message", label: "Message", type: "textarea", hideInTable: true, required: true },
        {
          key: "status",
          label: "Status",
          type: "select",
          options: [
            { label: "New", value: "new" },
            { label: "In progress", value: "in_progress" },
            { label: "Resolved", value: "resolved" },
          ],
        },
      ]}
    />
  );
}
