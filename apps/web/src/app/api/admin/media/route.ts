import { NextResponse } from "next/server";

import { canAccessModule, canWrite, getServerSession } from "@/lib/auth";
import { cloudinary } from "@/lib/cloudinary";
import { databaseErrorResponse } from "@/lib/database-response";
import { env } from "@/lib/env";
import { createAuditLog } from "@/server/auth-store";
import { mediaService } from "@/server/services";

async function authorize(write: boolean) {
  const session = await getServerSession();
  if (!session?.user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  if (!canAccessModule(session.user.role, "media")) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  if (write && !canWrite(session.user.role)) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { session };
}

export async function GET(request: Request) {
  try {
  const auth = await authorize(false);
  if (auth.error) return auth.error;

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.toLowerCase();
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const pageSize = Math.min(200, Math.max(1, Number(searchParams.get("pageSize") ?? 40)));

  let items = await mediaService.list();
  items = [...items].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (q) {
    items = items.filter((item) => JSON.stringify(item).toLowerCase().includes(q));
  }

  const total = items.length;
  const start = (page - 1) * pageSize;
  const data = items.slice(start, start + pageSize);

  return NextResponse.json({
    data,
    pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
  });
  } catch (error) {
    return databaseErrorResponse(error) ?? NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
  const auth = await authorize(true);
  if (auth.error) return auth.error;

  if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
    return NextResponse.json(
      { error: "Media storage is not configured. Set CLOUDINARY_* environment variables." },
      { status: 503 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const alt = (formData.get("alt") as string | null) ?? undefined;
  const folder = (formData.get("folder") as string | null) ?? "yourhomecare";

  if (!file) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const uploadResult = await new Promise<{
    secure_url: string;
    public_id: string;
    resource_type: string;
    bytes: number;
    format?: string;
  }>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder }, (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Upload failed"));
          return;
        }
        resolve(result as typeof result & { secure_url: string; public_id: string; resource_type: string; bytes: number });
      })
      .end(buffer);
  });

  const record = await mediaService.create({
    name: file.name,
    url: uploadResult.secure_url,
    publicId: uploadResult.public_id,
    resourceType: uploadResult.resource_type,
    mimeType: file.type,
    size: uploadResult.bytes ?? file.size,
    folder,
    alt,
    tags: [],
  });

  await createAuditLog({
    action: "create",
    userId: auth.session?.user?.id,
    userEmail: auth.session?.user?.email ?? undefined,
    resource: "media",
    resourceId: record.id,
  });

  return NextResponse.json(record, { status: 201 });
  } catch (error) {
    return databaseErrorResponse(error) ?? NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
  const auth = await authorize(true);
  if (auth.error) return auth.error;

  const body = await request.json();
  const id = body.id as string | undefined;
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const rest: Record<string, unknown> = { ...body };
  delete rest.id;
  const updated = await mediaService.update(id, rest);
  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await createAuditLog({
    action: "update",
    userId: auth.session?.user?.id,
    userEmail: auth.session?.user?.email ?? undefined,
    resource: "media",
    resourceId: id,
  });

  return NextResponse.json(updated);
  } catch (error) {
    return databaseErrorResponse(error) ?? NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
  const auth = await authorize(true);
  if (auth.error) return auth.error;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const existing = await mediaService.get(id);
  const ok = await mediaService.remove(id);
  if (!ok) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (existing?.publicId) {
    try {
      await cloudinary.uploader.destroy(existing.publicId);
    } catch {
      // ignore cloudinary cleanup failures
    }
  }

  await createAuditLog({
    action: "delete",
    userId: auth.session?.user?.id,
    userEmail: auth.session?.user?.email ?? undefined,
    resource: "media",
    resourceId: id,
  });

  return NextResponse.json({ success: true });
  } catch (error) {
    return databaseErrorResponse(error) ?? NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
