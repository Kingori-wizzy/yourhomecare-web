import { randomUUID } from "node:crypto";

import { toCamelCaseKeys } from "@/lib/case-map";
import {
  getSupabaseAnonClient,
  requireSupabaseServiceClient,
} from "@/lib/supabase";
import { DatabaseUnavailableError, isStrictCmsPersistence } from "@/server/db-errors";

export interface PublicReviewRecord {
  id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface SubmitReviewInput {
  name: string;
  email?: string;
  rating: number;
  comment: string;
}

export async function findRecentDuplicateReview(ipHash: string, comment: string): Promise<boolean> {
  const strict = isStrictCmsPersistence();

  if (strict) {
    const client = requireSupabaseServiceClient("client_reviews");
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { data, error } = await client
      .from("client_reviews")
      .select("id")
      .eq("ip_hash", ipHash)
      .eq("comment", comment)
      .gte("created_at", oneHourAgo)
      .limit(1);

    if (error) {
      throw new DatabaseUnavailableError("client_reviews", error.message);
    }

    return (data?.length ?? 0) > 0;
  }

  const client = getSupabaseAnonClient();
  if (!client) return false;

  const { data } = await client.from("client_reviews").select("id, ip_hash, comment, created_at");
  return (data ?? []).some(
    (review) =>
      review.ip_hash === ipHash &&
      String(review.comment).toLowerCase() === comment.toLowerCase() &&
      Date.now() - new Date(String(review.created_at)).getTime() < 60 * 60 * 1000,
  );
}

export async function createPublicReview(input: SubmitReviewInput, ipHash: string) {
  const now = new Date().toISOString();
  const record = {
    id: randomUUID(),
    name: input.name,
    email: input.email ?? null,
    rating: input.rating,
    comment: input.comment,
    status: "pending" as const,
    ip_hash: ipHash,
    created_at: now,
    updated_at: now,
  };

  const strict = isStrictCmsPersistence();
  const client = getSupabaseAnonClient();

  if (!client) {
    if (strict) {
      throw new DatabaseUnavailableError("client_reviews", "Configure SUPABASE_URL and SUPABASE_ANON_KEY.");
    }
    return toCamelCaseKeys(record);
  }

  const { data, error } = await client.from("client_reviews").insert(record).select().single();

  if (error) {
    throw new DatabaseUnavailableError("client_reviews", error.message);
  }

  return toCamelCaseKeys(data as Record<string, unknown>);
}

export async function listPublicApprovedReviews(options?: { page?: number; pageSize?: number }) {
  const page = Math.max(1, options?.page ?? 1);
  const pageSize = Math.min(50, Math.max(1, options?.pageSize ?? 12));
  const strict = isStrictCmsPersistence();
  const client = getSupabaseAnonClient();

  if (!client) {
    if (strict) {
      throw new DatabaseUnavailableError("client_reviews", "Configure SUPABASE_URL and SUPABASE_ANON_KEY.");
    }
    return {
      data: [] as PublicReviewRecord[],
      pagination: { page, pageSize, total: 0, totalPages: 0, hasMore: false },
    };
  }

  const readApproved = async () => {
    const viewResult = await client
      .from("public_client_reviews")
      .select("id, name, rating, comment, created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (!viewResult.error) {
      return viewResult;
    }

    if (!viewResult.error.message.includes("public_client_reviews")) {
      throw new DatabaseUnavailableError("client_reviews", viewResult.error.message);
    }

    return client
      .from("client_reviews")
      .select("id, name, rating, comment, created_at", { count: "exact" })
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);
  };

  const { data, error, count } = await readApproved();

  if (error) {
    throw new DatabaseUnavailableError("client_reviews", error.message);
  }

  const rows = (data ?? []).map((row) =>
    toCamelCaseKeys<PublicReviewRecord>(row as Record<string, unknown>),
  );
  const total = count ?? rows.length;

  return {
    data: rows,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
      hasMore: page * pageSize < total,
    },
  };
}
