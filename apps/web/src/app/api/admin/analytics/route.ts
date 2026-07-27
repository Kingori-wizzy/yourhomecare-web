import { NextResponse } from "next/server";

import { getServerSession, hasRole } from "@/lib/auth";
import { getDashboardMetrics } from "@/server/services";

export async function GET() {
  const session = await getServerSession();

  if (!session?.user || !hasRole(session.user.role, "staff")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(getDashboardMetrics());
}
