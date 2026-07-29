import type { Metadata } from "next";

import { AuthProvider } from "@/providers/auth-provider";

export const metadata: Metadata = {
  title: {
    default: "YourHomeCare Portal",
    template: "%s | YourHomeCare Portal",
  },
  description: "YourHomeCare staff administration portal.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-section text-slate-900">{children}</div>
    </AuthProvider>
  );
}
