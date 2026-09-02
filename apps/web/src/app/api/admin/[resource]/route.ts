import { NextResponse } from "next/server";

import { canAccessModule, canWrite, getServerSession } from "@/lib/auth";
import { databaseErrorResponse } from "@/lib/database-response";
import { createAuditLog } from "@/server/auth-store";
import { adminServiceRegistry, type AdminResource } from "@/server/services";

function resourceModule(resource: string): string {
  const map: Record<string, string> = {
    blog: "blog",
    jobs: "jobs",
    pages: "cms",
    settings: "settings",
    logs: "logs",
    faq: "faq",
    services: "services",
    solutions: "solutions",
    media: "media",
    users: "users",
    newsletters: "newsletters",
    reviews: "reviews",
    team: "team",
  };
  return map[resource] ?? resource;
}

async function authorize(resource: string, write: boolean) {
  const session = await getServerSession();
  if (!session?.user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const moduleName = resourceModule(resource);
  if (!canAccessModule(session.user.role, moduleName)) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  if (write && !canWrite(session.user.role)) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { session };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ resource: string }> }
) {
  try {
    const { resource } = await params;
    const auth = await authorize(resource, false);
    if (auth.error) return auth.error;

    const service = adminServiceRegistry[resource as AdminResource];
    if (!service) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const q = searchParams.get("q")?.toLowerCase();
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize") ?? 20)));
    const sort = searchParams.get("sort") ?? "createdAt";
    const order = searchParams.get("order") === "asc" ? "asc" : "desc";

    if (id) {
      const item = await service.get(id);
      if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(item);
    }

    let items = (await service.list()) as unknown as Array<Record<string, unknown>>;

    if (q) {
      items = items.filter((item) =>
        JSON.stringify(item).toLowerCase().includes(q)
      );
    }

    items.sort((a, b) => {
      const av = String(a[sort] ?? "");
      const bv = String(b[sort] ?? "");
      if (av === bv) return 0;
      const cmp = av > bv ? 1 : -1;
      return order === "asc" ? cmp : -cmp;
    });

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

export async function POST(
  request: Request,
  { params }: { params: Promise<{ resource: string }> }
) {
  try {
    const { resource } = await params;
    const auth = await authorize(resource, true);
    if (auth.error) return auth.error;

    const service = adminServiceRegistry[resource as AdminResource];
    if (!service || !("create" in service)) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    const body = await request.json();

    if (body?.bulkDelete && Array.isArray(body.ids)) {
      const results = await Promise.all(body.ids.map((id: string) => service.remove(id)));
      await createAuditLog({
        action: "bulk_delete",
        userId: auth.session?.user?.id,
        userEmail: auth.session?.user?.email ?? undefined,
        resource,
        details: { ids: body.ids },
      });
      return NextResponse.json({ success: true, deleted: results.filter(Boolean).length });
    }

    const created = await service.create(body);
    await createAuditLog({
      action: "create",
      userId: auth.session?.user?.id,
      userEmail: auth.session?.user?.email ?? undefined,
      resource,
      resourceId: (created as { id?: string })?.id,
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return databaseErrorResponse(error) ?? NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ resource: string }> }
) {
  try {
    const { resource } = await params;
    const auth = await authorize(resource, true);
    if (auth.error) return auth.error;

    const service = adminServiceRegistry[resource as AdminResource];
    if (!service) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    const body = await request.json();
    const id = body.id as string | undefined;
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const rest = { ...body };
    delete rest.id;
    const updated = await service.update(id, rest);
    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await createAuditLog({
      action: "update",
      userId: auth.session?.user?.id,
      userEmail: auth.session?.user?.email ?? undefined,
      resource,
      resourceId: id,
    });

    return NextResponse.json(updated);
  } catch (error) {
    return databaseErrorResponse(error) ?? NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ resource: string }> }
) {
  try {
    const { resource } = await params;
    const auth = await authorize(resource, true);
    if (auth.error) return auth.error;

    const service = adminServiceRegistry[resource as AdminResource];
    if (!service) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const ok = await service.remove(id);
    if (!ok) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await createAuditLog({
      action: "delete",
      userId: auth.session?.user?.id,
      userEmail: auth.session?.user?.email ?? undefined,
      resource,
      resourceId: id,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return databaseErrorResponse(error) ?? NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
