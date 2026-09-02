import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: "sm" | "md";
  className?: string;
}

export function StarRating({ rating, max = 5, size = "sm", className }: StarRatingProps) {
  const iconClass = size === "md" ? "h-5 w-5" : "h-4 w-4";

  return (
    <div
      className={cn("flex gap-1 text-secondary", className)}
      aria-label={`${rating} out of ${max} stars`}
    >
      {Array.from({ length: max }).map((_, index) => (
        <Star
          key={index}
          className={cn(
            iconClass,
            index < rating ? "fill-secondary text-secondary" : "text-secondary/25",
          )}
        />
      ))}
    </div>
  );
}
