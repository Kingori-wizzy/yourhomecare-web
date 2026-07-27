import type { Metadata } from "next";

import { MediaLibrary } from "@/components/portal/media-library";
import { requirePortalAccess } from "@/lib/portal-guard";

export const metadata: Metadata = { title: "Media library" };

export default async function MediaPage() {
  await requirePortalAccess("media");

  return <MediaLibrary />;
}
