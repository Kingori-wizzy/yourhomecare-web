import { redirect } from "next/navigation";

import { getServerSession } from "@/lib/auth";
import { PortalShell } from "@/components/portal/shell";

export default async function PortalDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/portal/login");
  }

  return (
    <PortalShell
      user={{
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
      }}
    >
      {children}
    </PortalShell>
  );
}
