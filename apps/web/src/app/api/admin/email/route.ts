import { NextResponse } from "next/server";

import { getServerSession, hasRole } from "@/lib/auth";
import { sendTransactionalEmail } from "@/lib/resend";

export async function POST(request: Request) {
  const session = await getServerSession();

  if (!session?.user || !hasRole(session.user.role, "admin")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const result = await sendTransactionalEmail({
    to: body.to,
    subject: body.subject,
    html: body.html,
  });

  return NextResponse.json(result);
}
