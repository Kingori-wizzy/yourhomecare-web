import { NextResponse } from "next/server";

const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

export function sanitizeInput(value: string) {
  return value.replace(/[<>]/g, "").trim();
}

export function withRateLimit() {
  return { limited: false };
}

export function rateLimit(key: string, limit = 10, windowMs = 60_000) {
  const now = Date.now();
  const current = rateLimitBuckets.get(key);

  if (current && current.resetAt > now) {
    if (current.count >= limit) {
      return false;
    }

    current.count += 1;
    return true;
  }

  rateLimitBuckets.set(key, { count: 1, resetAt: now + windowMs });
  return true;
}

export function getSecurityHeaders() {
  return {
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=()",
  };
}

export function createRateLimitError() {
  return NextResponse.json(
    { success: false, message: "Too many requests. Please try again shortly." },
    { status: 429 }
  );
}

export function withSecurityHeaders(response: NextResponse) {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Permissions-Policy", "camera=(), microphone=()");
  return response;
}

