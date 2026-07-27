import { redirect } from "next/navigation";

import { getServerSession } from "@/lib/auth";
import { canAccessModule } from "@/lib/roles";

export async function requirePortalAccess(module: string) {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/portal/login");
  }

  if (!canAccessModule(session.user.role, module)) {
    redirect("/portal");
  }

  return session;
}
