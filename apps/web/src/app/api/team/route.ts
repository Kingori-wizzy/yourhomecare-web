import { NextResponse } from "next/server";

import { publicDatabaseErrorResponse } from "@/lib/database-response";
import { teamPublicService } from "@/server/services";

export async function GET() {
  try {
    const members = await teamPublicService.list();
    const active = members
      .filter((member) => member.isActive !== false)
      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
      .map(({ id, fullName, title, rank, biography, department, photoUrl, displayOrder }) => ({
        id,
        fullName,
        title,
        rank,
        biography,
        department,
        photoUrl,
        displayOrder,
      }));

    return NextResponse.json({ data: active });
  } catch (error) {
    return (
      publicDatabaseErrorResponse(error) ??
      NextResponse.json({ success: false, message: "Unable to load team profiles." }, { status: 500 })
    );
  }
}
