import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft, HeartPulse } from "lucide-react";

import { ResetPasswordForm } from "@/components/portal/reset-password-form";

export const metadata: Metadata = {
  title: "Reset password",
};

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <span className="flex size-12 items-center justify-center rounded-xl bg-[#0F6CBD]/10 text-[#0F6CBD]">
            <HeartPulse className="size-6" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Set a new password</h1>
            <p className="mt-1 text-sm text-slate-500">
              Choose a strong new password for your portal account.
            </p>
          </div>
        </div>

        <Suspense fallback={null}>
          <ResetPasswordForm />
        </Suspense>

        <Link
          href="/portal/login"
          className="mt-6 flex items-center justify-center gap-1.5 text-sm font-medium text-slate-500 hover:text-[#0F6CBD]"
        >
          <ArrowLeft className="size-4" />
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
