import type { Metadata } from "next";

import { SettingsEditor } from "@/components/portal/settings-editor";
import { requirePortalAccess } from "@/lib/portal-guard";

export const metadata: Metadata = { title: "Website settings" };

export default async function SettingsPage() {
  await requirePortalAccess("settings");

  return <SettingsEditor />;
}
