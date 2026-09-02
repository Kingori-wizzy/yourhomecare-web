import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { PageHero } from "@/components/common/page-hero";
import { TestimonialCard } from "@/components/cards/testimonial-card";
import { CallToAction } from "@/components/sections/home/cta";
import { ReviewForm } from "@/components/reviews/review-form";
import { ClientReviewsSection } from "@/components/reviews/client-reviews-section";
import { buildMetadata } from "@/lib/metadata";
import {
  getApprovedReviews,
  getPageContent,
  getPublishedTestimonials,
  toReviewItems,
  toTestimonialItems,
} from "@/server/cms";

export const metadata = buildMetadata({
  title: "Reviews & Testimonials",
  description: "Read client reviews and stories from patients, families and partners who trust YourHomeCare.",
  path: "/testimonials",
});

export const dynamic = "force-dynamic";

export default async function TestimonialsPage() {
  const [content, testimonials, reviewsResult] = await Promise.all([
    getPageContent("testimonials"),
    getPublishedTestimonials(),
    getApprovedReviews({ page: 1, pageSize: 12 }),
  ]);
  const items = toTestimonialItems(testimonials);

  return (
    <>
      <PageHero
        badge={content.badge || "Testimonials"}
        title={content.title}
        description={content.description}
        imageUrl="/images/flyers/loved-ones-home.png"
        primaryCta={{ label: "Find Care", href: "/appointments" }}
        secondaryCta={{ label: "Our Services", href: "/services" }}
        priority
      />

      <Section className="bg-white">
        <Container>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((testimonial, index) => (
              <TestimonialCard key={`${testimonial.name}-${index}`} testimonial={testimonial} />
            ))}
          </div>
        </Container>
      </Section>

      <ClientReviewsSection
        initialReviews={toReviewItems(reviewsResult.data)}
        initialHasMore={reviewsResult.pagination.hasMore}
      />

      <Section id="submit-review" className="bg-white scroll-mt-24">
        <Container>
          <ReviewForm />
        </Container>
      </Section>

      <CallToAction />
    </>
  );
}
