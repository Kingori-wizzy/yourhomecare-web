"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Star } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ReviewSchema, type ReviewInput } from "@/lib/validations/review";
import { cn } from "@/lib/utils";

export function ReviewForm() {
  const [loading, setLoading] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReviewInput>({
    resolver: zodResolver(ReviewSchema),
    defaultValues: { rating: 0, name: "", email: "", comment: "" },
  });

  const rating = watch("rating");

  async function onSubmit(data: ReviewInput) {
    setLoading(true);
    setSubmitError(null);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        const message = result.message ?? "Unable to submit review.";
        setSubmitError(message);
        toast.error(message);
        return;
      }

      setSubmitted(true);
      reset({ rating: 0, name: "", email: "", comment: "" });
      toast.success(
        "Thank you for your review. Your review has been submitted and is awaiting approval.",
      );
    } catch {
      const message = "Something went wrong. Please try again.";
      setSubmitError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-[8px] border border-secondary/20 bg-secondary/5 p-8 text-center">
        <p className="text-lg font-semibold text-primary">Thank you for your review.</p>
        <p className="mt-2 text-muted-foreground">
          Your review has been submitted and is awaiting approval.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-6"
          onClick={() => {
            setSubmitted(false);
            setSubmitError(null);
          }}
        >
          Submit another review
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-[8px] border border-border bg-white p-6 shadow-[var(--shadow-sm)]">
      <h3 className="text-xl font-bold text-primary">Share Your Experience</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Tell us about your experience with YourHomeCare. All reviews are moderated before publishing.
      </p>

      <div className="mt-6">
        <label className="mb-2 block text-sm font-medium text-slate-700">Your rating</label>
        <div className="flex gap-1" role="radiogroup" aria-label="Rating">
          {Array.from({ length: 5 }).map((_, index) => {
            const value = index + 1;
            const active = value <= (hoverRating || rating);
            return (
              <button
                key={value}
                type="button"
                className="rounded p-1 transition hover:scale-110"
                aria-label={`${value} star${value > 1 ? "s" : ""}`}
                onMouseEnter={() => setHoverRating(value)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setValue("rating", value, { shouldValidate: true })}
              >
                <Star
                  className={cn(
                    "h-7 w-7",
                    active ? "fill-secondary text-secondary" : "text-slate-300",
                  )}
                />
              </button>
            );
          })}
        </div>
        {errors.rating ? <p className="mt-1.5 text-sm text-red-600">{errors.rating.message}</p> : null}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="review-name" className="mb-1.5 block text-sm font-medium text-slate-700">
            Name
          </label>
          <Input id="review-name" {...register("name")} placeholder="Your name" />
          {errors.name ? <p className="mt-1.5 text-sm text-red-600">{errors.name.message}</p> : null}
        </div>
        <div>
          <label htmlFor="review-email" className="mb-1.5 block text-sm font-medium text-slate-700">
            Email (optional)
          </label>
          <Input id="review-email" type="email" {...register("email")} placeholder="you@example.com" />
          {errors.email ? <p className="mt-1.5 text-sm text-red-600">{errors.email.message}</p> : null}
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="review-comment" className="mb-1.5 block text-sm font-medium text-slate-700">
          Your review
        </label>
        <textarea
          id="review-comment"
          rows={4}
          className="w-full rounded-[8px] border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          placeholder="Share your experience with our care team..."
          {...register("comment")}
        />
        {errors.comment ? <p className="mt-1.5 text-sm text-red-600">{errors.comment.message}</p> : null}
      </div>

      {submitError ? (
        <p className="mt-4 rounded-[8px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {submitError}
        </p>
      ) : null}

      <Button type="submit" disabled={loading} className="mt-6 bg-secondary text-white hover:bg-secondary/90">
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Review"
        )}
      </Button>
    </form>
  );
}
