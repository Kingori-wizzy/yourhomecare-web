import type { Metadata } from "next";

import { ResourceManager } from "@/components/portal/resource-manager";
import { requirePortalAccess } from "@/lib/portal-guard";
import { PORTAL_ROLES } from "@/lib/roles";

export const metadata: Metadata = { title: "Users" };

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  administrator: "Administrator",
  operations: "Operations",
  hr: "HR",
  marketing: "Marketing",
  content_manager: "Content Manager",
  read_only: "Read Only",
};

export default async function UsersPage() {
  await requirePortalAccess("users");

  return (
    <ResourceManager
      resource="users"
      title="Portal users"
      description="Manage staff accounts and their portal access roles."
      fields={[
        { key: "name", label: "Name", type: "text", required: true },
        { key: "email", label: "Email", type: "email", required: true },
        {
          key: "role",
          label: "Role",
          type: "select",
          required: true,
          options: PORTAL_ROLES.map((role) => ({ label: ROLE_LABELS[role] ?? role, value: role })),
        },
        { key: "isActive", label: "Active", type: "boolean" },
      ]}
    />
  );
}
