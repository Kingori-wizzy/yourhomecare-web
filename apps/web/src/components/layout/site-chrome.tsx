"use client";

import { usePathname } from "next/navigation";

import { Header } from "@/components/layout/header";

interface SiteChromeProps {
  children: React.ReactNode;
  footer: React.ReactNode;
}

export function SiteChrome({ children, footer }: SiteChromeProps) {
  const pathname = usePathname();
  const isPortal = pathname?.startsWith("/portal") ?? false;

  if (isPortal) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main>{children}</main>
      {footer}
    </>
  );
}
