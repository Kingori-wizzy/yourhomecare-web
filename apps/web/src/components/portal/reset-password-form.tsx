"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, Lock } from "lucide-react";

import { ResetPasswordSchema, type ResetPasswordFormData } from "@/lib/validations/auth";
import { useSubmit } from "@/lib/hooks/use-submit";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const { loading, submit } = useSubmit();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { token },
  });

  async function onSubmit(data: ResetPasswordFormData) {
    setError(null);

    try {
      const response = await submit("/api/admin/auth/reset", data);

      if (response?.success) {
        setDone(true);
        setTimeout(() => router.push("/portal/login"), 2500);
      } else {
        setError(response?.message ?? "Unable to reset your password.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
  }

  if (!token) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        This reset link is missing a token. Please request a new password reset link.
      </div>
    );
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <CheckCircle2 className="size-8 text-[#14B87A]" />
        <p className="font-medium text-slate-900">Password updated</p>
        <p className="text-sm text-slate-600">Redirecting you to sign in...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <input type="hidden" {...register("token")} value={token} />

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">
          New password
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            className="h-11 pl-8"
            {...register("password")}
          />
        </div>
        {errors.password && <p className="mt-1.5 text-sm text-red-600">{errors.password.message}</p>}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-slate-700">
          Confirm new password
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Re-enter your new password"
            className="h-11 pl-8"
            {...register("confirmPassword")}
          />
        </div>
        {errors.confirmPassword && (
          <p className="mt-1.5 text-sm text-red-600">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="h-11 w-full bg-[#0F6CBD] text-white hover:bg-[#0d5a9e]"
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Updating password...
          </>
        ) : (
          "Reset password"
        )}
      </Button>
    </form>
  );
}
