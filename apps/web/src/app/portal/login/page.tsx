import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { HeartPulse, ShieldCheck } from "lucide-react";

import { LoginForm } from "@/components/portal/login-form";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function PortalLoginPage() {
  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-[#0F6CBD] to-[#0a4d87] p-12 text-white lg:flex">
        <div className="absolute inset-0 opacity-10 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:24px_24px]" />

        <div className="relative flex items-center gap-2 text-lg font-semibold">
          <span className="flex size-10 items-center justify-center rounded-xl bg-white/15">
            <HeartPulse className="size-5" />
          </span>
          {siteConfig.name}
        </div>

        <div className="relative max-w-md">
          <h1 className="text-3xl font-bold leading-tight">
            Staff Portal
          </h1>
          <p className="mt-4 text-base text-white/85">
            Manage patients, appointments, referrals, and the YourHomeCare
            website content, all from one secure workspace built for our
            care coordination team.
          </p>
          <div className="mt-8 flex items-center gap-2 text-sm text-white/80">
            <ShieldCheck className="size-5 shrink-0" />
            Protected by role-based access, audit logging and secure sessions.
          </div>
        </div>

        <p className="relative text-sm text-white/60">
          &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
      </div>

      <div className="flex w-full flex-1 items-center justify-center bg-white p-6 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center gap-3 lg:hidden">
            <span className="flex size-12 items-center justify-center rounded-xl bg-[#0F6CBD]/10 text-[#0F6CBD]">
              <HeartPulse className="size-6" />
            </span>
            <p className="text-lg font-semibold text-slate-900">{siteConfig.name}</p>
          </div>

          <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
          <p className="mt-1.5 text-sm text-slate-500">
            Sign in with your staff credentials to access the portal.
          </p>

          <div className="mt-8">
            <Suspense fallback={null}>
              <LoginForm />
            </Suspense>
          </div>

          <p className="mt-8 text-center text-sm text-slate-500">
            Need access? Contact your{" "}
            <Link href={`mailto:${siteConfig.email}`} className="font-medium text-[#0F6CBD] hover:underline">
              system administrator
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
