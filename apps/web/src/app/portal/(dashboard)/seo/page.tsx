import type { Metadata } from "next";

import { SeoEditor } from "@/components/portal/seo-editor";
import { requirePortalAccess } from "@/lib/portal-guard";

export const metadata: Metadata = { title: "SEO" };

export default async function SeoPage() {
  await requirePortalAccess("seo");

  return <SeoEditor />;
}
