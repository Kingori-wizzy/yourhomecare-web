import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // standalone is for Hostinger/PM2 production builds only.
  // Enabling it during local `next dev` can confuse routing — set via env when deploying:
  ...(process.env.NEXT_OUTPUT_STANDALONE === "1" ? { output: "standalone" as const } : {}),
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
      { protocol: "https", hostname: "yourhomecare.co.ke", pathname: "/**" },
    ],
  },
  poweredByHeader: false,
  async redirects() {
    return [
      { source: "/team", destination: "/about#team", permanent: true },
      { source: "/reviews", destination: "/testimonials#reviews", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/portal/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
      {
        source: "/api/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "no-store" },
        ],
      },
    ];
  },
};

export default nextConfig;
