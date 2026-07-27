import type { Metadata } from "next";

import { ResourceManager } from "@/components/portal/resource-manager";
import { requirePortalAccess } from "@/lib/portal-guard";

export const metadata: Metadata = { title: "Careers" };

export default async function CareersPage() {
  await requirePortalAccess("careers");

  return (
    <ResourceManager
      resource="careers"
      title="Career applications"
      description="Review job applications submitted through the careers page."
      fields={[
        { key: "fullName", label: "Full name", type: "text", required: true },
        { key: "email", label: "Email", type: "email", required: true },
        { key: "phone", label: "Phone", type: "text" },
        { key: "role", label: "Role applied for", type: "text", required: true },
        { key: "experience", label: "Experience", type: "text", hideInTable: true },
        { key: "coverLetter", label: "Cover letter", type: "textarea", hideInTable: true },
        { key: "resumeUrl", label: "Resume URL", type: "url", hideInTable: true },
        {
          key: "status",
          label: "Status",
          type: "select",
          options: [
            { label: "New", value: "new" },
            { label: "Shortlisted", value: "shortlisted" },
            { label: "Interview", value: "interview" },
            { label: "Hired", value: "hired" },
            { label: "Rejected", value: "rejected" },
          ],
        },
      ]}
    />
  );
}
