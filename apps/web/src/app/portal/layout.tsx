import type { Metadata } from "next";

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
  return <div className="min-h-screen bg-slate-50 text-slate-900">{children}</div>;
}
