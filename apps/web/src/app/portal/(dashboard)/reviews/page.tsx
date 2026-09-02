import type { Metadata } from "next";

import { ResourceManager } from "@/components/portal/resource-manager";
import { requirePortalAccess } from "@/lib/portal-guard";

export const metadata: Metadata = { title: "Reviews" };

export default async function ReviewsPage() {
  await requirePortalAccess("reviews");

  return (
    <ResourceManager
      resource="reviews"
      title="Client Reviews"
      description="Moderate ratings and reviews submitted by clients and families."
      fields={[
        { key: "name", label: "Name", type: "text", required: true },
        { key: "email", label: "Email", type: "email", hideInTable: true },
        { key: "rating", label: "Rating", type: "number", required: true },
        { key: "comment", label: "Review", type: "textarea", required: true, hideInTable: true },
        {
          key: "status",
          label: "Status",
          type: "select",
          options: [
            { label: "Pending", value: "pending" },
            { label: "Approved", value: "approved" },
            { label: "Rejected", value: "rejected" },
          ],
        },
        { key: "createdAt", label: "Submitted", type: "text", hideInTable: false, hideInForm: true },
      ]}
    />
  );
}
