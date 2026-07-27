import type { Metadata } from "next";

import { ResourceManager } from "@/components/portal/resource-manager";
import { requirePortalAccess } from "@/lib/portal-guard";

export const metadata: Metadata = { title: "FAQ" };

export default async function FaqPage() {
  await requirePortalAccess("faq");

  return (
    <ResourceManager
      resource="faq"
      title="Frequently asked questions"
      description="Manage the FAQ entries shown across the website."
      fields={[
        { key: "question", label: "Question", type: "textarea", required: true },
        { key: "answer", label: "Answer", type: "textarea", required: true, hideInTable: true },
        { key: "category", label: "Category", type: "text" },
        { key: "visible", label: "Visible", type: "boolean" },
        { key: "displayOrder", label: "Display order", type: "number", hideInTable: true },
      ]}
    />
  );
}
