import type { Metadata } from "next";
import "./globals.css";

import { SiteChrome } from "@/components/layout/site-chrome";
import { Footer } from "@/components/layout/footer";

import { fontSans, fontMono } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { getSiteSettings } from "@/server/cms";

import { Toaster } from "sonner";
import { QueryProvider } from "@/providers/query-provider";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },

  description: siteConfig.description,

  metadataBase: new URL(siteConfig.url),

  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    locale: "en_KE",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },

  robots: {
    index: true,
    follow: true,
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({
  children,
}: Readonly<RootLayoutProps>) {
  const settings = await getSiteSettings();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          fontSans.variable,
          fontMono.variable,
          "min-h-screen bg-background font-sans antialiased"
        )}
      >
        <QueryProvider>
          <SiteChrome
            footer={<Footer />}
            branding={{
              name: settings.branding.name,
              tagline: settings.branding.tagline,
              logoUrl: settings.branding.logoUrl,
            }}
          >
            {children}
          </SiteChrome>
          <Toaster
            richColors
            position="top-right"
          />
        </QueryProvider>
      </body>
    </html>
  );
}