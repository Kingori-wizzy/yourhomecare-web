import { NextResponse } from "next/server";

import { siteConfig } from "@/config/site";

export function GET() {
  const body = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /portal",
    "Disallow: /admin",
    "Disallow: /api/",
    `Sitemap: ${siteConfig.url}/sitemap.xml`,
    "",
  ].join("\n");

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
