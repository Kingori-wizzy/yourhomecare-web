import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, HeartPulse } from "lucide-react";

import { ForgotPasswordForm } from "@/components/portal/forgot-password-form";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Forgot password",
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <span className="flex size-12 items-center justify-center rounded-xl bg-[#0F6CBD]/10 text-[#0F6CBD]">
            <HeartPulse className="size-6" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Forgot your password?</h1>
            <p className="mt-1 text-sm text-slate-500">
              Enter your portal email and we&rsquo;ll send you a link to reset it.
            </p>
          </div>
        </div>

        <ForgotPasswordForm />

        <Link
          href="/portal/login"
          className="mt-6 flex items-center justify-center gap-1.5 text-sm font-medium text-slate-500 hover:text-[#0F6CBD]"
        >
          <ArrowLeft className="size-4" />
          Back to sign in
        </Link>
      </div>

      <p className="sr-only">{siteConfig.name} staff portal password recovery</p>
    </div>
  );
}
