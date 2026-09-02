"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import { ReviewCard } from "@/components/cards/review-card";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import type { ReviewItem } from "@/server/cms";

interface ClientReviewsSectionProps {
  initialReviews: ReviewItem[];
  initialHasMore: boolean;
  title?: string;
  description?: string;
  id?: string;
}

export function ClientReviewsSection({
  initialReviews,
  initialHasMore,
  title = "Client Reviews",
  description = "Ratings and reviews from families who have experienced our care.",
  id = "reviews",
}: ClientReviewsSectionProps) {
  const [reviews, setReviews] = useState(initialReviews);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);

  async function loadMore() {
    setLoading(true);
    try {
      const nextPage = page + 1;
      const response = await fetch(`/api/reviews?page=${nextPage}&pageSize=12`);
      const result = await response.json();
      setReviews((current) => [...current, ...(result.data ?? [])]);
      setPage(nextPage);
      setHasMore(Boolean(result.pagination?.hasMore));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Section id={id} className="bg-section scroll-mt-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">Reviews</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-primary lg:text-5xl">{title}</h2>
          <p className="mt-4 text-lg leading-[1.6] text-muted-foreground">{description}</p>
        </div>

        {reviews.length > 0 ? (
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <p className="mt-14 text-center text-muted-foreground">
            No approved reviews yet. Be the first to share your experience below.
          </p>
        )}

        {hasMore ? (
          <div className="mt-10 flex justify-center">
            <Button type="button" variant="outline" disabled={loading} onClick={loadMore}>
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Load more reviews"
              )}
            </Button>
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
