"use client";

import { usePathname } from "next/navigation";

import { Header } from "@/components/layout/header";

interface SiteChromeProps {
  children: React.ReactNode;
  footer: React.ReactNode;
  branding?: {
    name?: string;
    tagline?: string;
    logoUrl?: string;
  };
}

export function SiteChrome({ children, footer, branding }: SiteChromeProps) {
  const pathname = usePathname();
  const isPortal = pathname?.startsWith("/portal") ?? false;

  if (isPortal) {
    return <>{children}</>;
  }

  return (
    <>
      <Header branding={branding} />
      <main>{children}</main>
      {footer}
    </>
  );
}
