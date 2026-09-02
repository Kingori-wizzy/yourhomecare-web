import { StarRating } from "@/components/common/star-rating";
import type { TestimonialItem } from "@/server/cms";

interface TestimonialCardProps {
  testimonial: TestimonialItem;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <article className="rounded-[8px] border border-border bg-[#f8f9ff] p-7 shadow-[var(--shadow-sm)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-md)]">
      <StarRating rating={testimonial.rating} />

      <p className="mt-5 text-base leading-[1.6] text-primary/90">“{testimonial.quote}”</p>

      <div className="mt-7 border-t border-border pt-5">
        <h3 className="font-bold text-primary">{testimonial.name}</h3>
        {testimonial.role ? (
          <p className="mt-1 text-sm text-muted-foreground">{testimonial.role}</p>
        ) : null}
      </div>
    </article>
  );
}
