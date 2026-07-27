import type { Metadata } from "next";

import { CmsEditor } from "@/components/portal/cms-editor";
import { requirePortalAccess } from "@/lib/portal-guard";

export const metadata: Metadata = { title: "CMS pages" };

export default async function CmsPage() {
  await requirePortalAccess("cms");

  return <CmsEditor />;
}
