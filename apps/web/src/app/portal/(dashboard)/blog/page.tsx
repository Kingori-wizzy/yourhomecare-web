import type { Metadata } from "next";

import { ResourceManager } from "@/components/portal/resource-manager";
import { requirePortalAccess } from "@/lib/portal-guard";

export const metadata: Metadata = { title: "Blog" };

export default async function BlogPage() {
  await requirePortalAccess("blog");

  return (
    <ResourceManager
      resource="blog"
      title="Blog posts"
      description="Write and publish articles shown on the public blog."
      fields={[
        { key: "title", label: "Title", type: "text", required: true },
        { key: "slug", label: "Slug", type: "text", required: true },
        { key: "excerpt", label: "Excerpt", type: "textarea", hideInTable: true },
        { key: "content", label: "Content", type: "textarea", hideInTable: true, required: true },
        { key: "featuredImageUrl", label: "Featured image URL", type: "url", hideInTable: true },
        { key: "authorName", label: "Author", type: "text" },
        { key: "tags", label: "Tags", type: "text", isList: true, hideInTable: true, helperText: "Comma-separated tags." },
        {
          key: "status",
          label: "Status",
          type: "select",
          options: [
            { label: "Draft", value: "draft" },
            { label: "Published", value: "published" },
            { label: "Scheduled", value: "scheduled" },
            { label: "Archived", value: "archived" },
          ],
        },
        { key: "published", label: "Published", type: "boolean" },
        { key: "seoTitle", label: "SEO title", type: "text", hideInTable: true },
        { key: "seoDescription", label: "SEO description", type: "textarea", hideInTable: true },
      ]}
    />
  );
}
