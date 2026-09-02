import { createHash } from "node:crypto";

import { NextResponse } from "next/server";

import { ReviewSchema } from "@/lib/validations/review";
import { publicDatabaseErrorResponse } from "@/lib/database-response";
import { createRateLimitError, rateLimit, sanitizeInput } from "@/lib/security";
import {
  createPublicReview,
  findRecentDuplicateReview,
  listPublicApprovedReviews,
} from "@/server/review-public";

function getClientKey(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";
}

function hashIp(ip: string) {
  return createHash("sha256").update(ip).digest("hex");
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const pageSize = Math.min(50, Math.max(1, Number(searchParams.get("pageSize") ?? 12)));

    const result = await listPublicApprovedReviews({ page, pageSize });

    return NextResponse.json({
      data: result.data.map(({ id, name, rating, comment, createdAt }) => ({
        id,
        name,
        rating,
        comment,
        createdAt,
      })),
      pagination: result.pagination,
    });
  } catch (error) {
    return (
      publicDatabaseErrorResponse(error) ??
      NextResponse.json({ success: false, message: "Unable to load reviews." }, { status: 500 })
    );
  }
}

export async function POST(request: Request) {
  const clientKey = getClientKey(request);

  if (!rateLimit(`reviews:${clientKey}`, 5, 60_000)) {
    return createRateLimitError();
  }

  try {
    const body = await request.json();
    const parsed = ReviewSchema.safeParse({
      name: body.name,
      email: body.email,
      rating: typeof body.rating === "string" ? Number(body.rating) : body.rating,
      comment: body.comment,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: parsed.error.issues[0]?.message ?? "Validation failed." },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const ipHash = hashIp(clientKey);
    const sanitizedComment = sanitizeInput(data.comment);

    const duplicate = await findRecentDuplicateReview(ipHash, sanitizedComment);

    if (duplicate) {
      return NextResponse.json(
        { success: false, message: "You have already submitted this review recently." },
        { status: 409 },
      );
    }

    await createPublicReview(
      {
        name: sanitizeInput(data.name),
        email: data.email ? sanitizeInput(data.email) : undefined,
        rating: data.rating,
        comment: sanitizedComment,
      },
      ipHash,
    );

    return NextResponse.json({
      success: true,
      message: "Thank you! Your review has been submitted and will appear after moderation.",
    });
  } catch (error) {
    return (
      publicDatabaseErrorResponse(error) ??
      NextResponse.json(
        { success: false, message: "Unable to submit your review right now. Please try again." },
        { status: 500 },
      )
    );
  }
}
