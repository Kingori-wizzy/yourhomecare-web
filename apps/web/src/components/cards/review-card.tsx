import { StarRating } from "@/components/common/star-rating";
import type { ReviewItem } from "@/server/cms";

interface ReviewCardProps {
  review: ReviewItem;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <article className="rounded-[8px] border border-border bg-[#f8f9ff] p-7 shadow-[var(--shadow-sm)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-md)]">
      <StarRating rating={review.rating} />

      <p className="mt-5 text-base leading-[1.6] text-primary/90">“{review.comment}”</p>

      <div className="mt-7 border-t border-border pt-5">
        <h3 className="font-bold text-primary">{review.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {new Date(review.createdAt).toLocaleDateString("en-KE", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
    </article>
  );
}
