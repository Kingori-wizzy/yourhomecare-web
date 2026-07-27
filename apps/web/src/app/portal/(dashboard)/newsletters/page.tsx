import type { Metadata } from "next";

import { ResourceManager } from "@/components/portal/resource-manager";
import { requirePortalAccess } from "@/lib/portal-guard";

export const metadata: Metadata = { title: "Newsletters" };

export default async function NewslettersPage() {
  await requirePortalAccess("newsletters");

  return (
    <ResourceManager
      resource="newsletters"
      title="Newsletter subscribers"
      description="Manage subscribers who opted in for the YourHomeCare newsletter."
      fields={[
        { key: "email", label: "Email", type: "email", required: true },
        { key: "name", label: "Name", type: "text" },
        { key: "consent", label: "Consent given", type: "boolean" },
      ]}
    />
  );
}
