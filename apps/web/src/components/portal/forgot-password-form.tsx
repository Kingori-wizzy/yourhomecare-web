"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, Mail } from "lucide-react";

import { ForgotPasswordSchema, type ForgotPasswordFormData } from "@/lib/validations/auth";
import { useSubmit } from "@/lib/hooks/use-submit";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ForgotPasswordForm() {
  const { loading, submit } = useSubmit();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  async function onSubmit(data: ForgotPasswordFormData) {
    setError(null);

    try {
      const response = await submit("/api/admin/auth/forgot", data);

      if (response?.success) {
        setSent(true);
      } else {
        setError(response?.message ?? "Unable to process your request.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <CheckCircle2 className="size-8 text-[#14B87A]" />
        <p className="font-medium text-slate-900">Check your email</p>
        <p className="text-sm text-slate-600">
          If an account exists for that email, we&rsquo;ve sent a link to reset your password.
        </p>
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

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
          Email address
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@yourhomecare.co.ke"
            className="h-11 pl-8"
            {...register("email")}
          />
        </div>
        {errors.email && <p className="mt-1.5 text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="h-11 w-full bg-[#0F6CBD] text-white hover:bg-[#0d5a9e]"
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Sending link...
          </>
        ) : (
          "Send reset link"
        )}
      </Button>
    </form>
  );
}
