import type { Metadata } from "next";

import { ResourceManager } from "@/components/portal/resource-manager";
import { requirePortalAccess } from "@/lib/portal-guard";

export const metadata: Metadata = { title: "Solutions" };

export default async function SolutionsPage() {
  await requirePortalAccess("solutions");

  return (
    <ResourceManager
      resource="solutions"
      title="Solutions"
      description="Manage care solutions and programs displayed on the website."
      fields={[
        { key: "title", label: "Title", type: "text", required: true },
        { key: "slug", label: "Slug", type: "text", required: true },
        { key: "description", label: "Description", type: "textarea", hideInTable: true },
        { key: "features", label: "Features", type: "text", isList: true, hideInTable: true, helperText: "Comma-separated list." },
        { key: "icon", label: "Icon", type: "text", hideInTable: true },
        { key: "imageUrl", label: "Image URL", type: "url", hideInTable: true },
        { key: "seoTitle", label: "SEO title", type: "text", hideInTable: true },
        { key: "seoDescription", label: "SEO description", type: "textarea", hideInTable: true },
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "displayOrder", label: "Display order", type: "number", hideInTable: true },
      ]}
    />
  );
}
