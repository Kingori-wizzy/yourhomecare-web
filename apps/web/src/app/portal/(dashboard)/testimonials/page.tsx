import type { Metadata } from "next";

import { ResourceManager } from "@/components/portal/resource-manager";
import { requirePortalAccess } from "@/lib/portal-guard";

export const metadata: Metadata = { title: "Testimonials" };

export default async function TestimonialsPage() {
  await requirePortalAccess("testimonials");

  return (
    <ResourceManager
      resource="testimonials"
      title="Testimonials"
      description="Curate patient and family testimonials shown across the website."
      fields={[
        { key: "author", label: "Author", type: "text", required: true },
        { key: "role", label: "Role", type: "text" },
        { key: "quote", label: "Quote", type: "textarea", required: true, hideInTable: true },
        { key: "photoUrl", label: "Photo URL", type: "url", hideInTable: true },
        { key: "rating", label: "Rating", type: "number" },
        { key: "featured", label: "Featured", type: "boolean" },
        { key: "approved", label: "Approved", type: "boolean" },
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "displayOrder", label: "Display order", type: "number", hideInTable: true },
      ]}
    />
  );
}
