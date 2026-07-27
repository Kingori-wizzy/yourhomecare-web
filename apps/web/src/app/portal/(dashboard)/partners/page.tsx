import type { Metadata } from "next";

import { ResourceManager } from "@/components/portal/resource-manager";
import { requirePortalAccess } from "@/lib/portal-guard";

export const metadata: Metadata = { title: "Partners" };

export default async function PartnersPage() {
  await requirePortalAccess("partners");

  return (
    <ResourceManager
      resource="partners"
      title="Partners"
      description="Manage hospitals, insurers and organizations featured on the website."
      fields={[
        { key: "name", label: "Name", type: "text", required: true },
        { key: "description", label: "Description", type: "textarea", hideInTable: true },
        { key: "websiteUrl", label: "Website URL", type: "url", hideInTable: true },
        { key: "logoUrl", label: "Logo URL", type: "url", hideInTable: true },
        { key: "category", label: "Category", type: "text" },
        { key: "featured", label: "Featured", type: "boolean" },
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "displayOrder", label: "Display order", type: "number", hideInTable: true },
      ]}
    />
  );
}
