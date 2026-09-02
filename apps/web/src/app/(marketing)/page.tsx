import { Hero } from "@/components/sections/home/hero";
import { Services } from "@/components/sections/home/services";
import { TrustSection } from "@/components/sections/home/trust";
import { Testimonials } from "@/components/sections/home/testimonials";
import { LatestArticles } from "@/components/sections/home/blog";
import { CallToAction } from "@/components/sections/home/cta";
import { ClientReviewsSection } from "@/components/reviews/client-reviews-section";

import {
  getApprovedReviews,
  getPageContent,
  getPublishedBlogPosts,
  getPublishedTestimonials,
  toBlogPostItems,
  toReviewItems,
  toTestimonialItems,
} from "@/server/cms";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [homeContent, testimonials, blogPosts, reviewsResult] = await Promise.all([
    getPageContent("home"),
    getPublishedTestimonials(),
    getPublishedBlogPosts(),
    getApprovedReviews({ page: 1, pageSize: 6 }),
  ]);

  return (
    <>
      <Hero hero={homeContent.hero} />
      <Services />
      <TrustSection />
      <Testimonials
        heading={{
          badge: "Testimonials",
          title: "What Our Families Say",
          description:
            "Real stories from patients and partners who trust YourHomeCare with the people they love most.",
        }}
        testimonials={toTestimonialItems(testimonials)}
      />
      <ClientReviewsSection
        initialReviews={toReviewItems(reviewsResult.data)}
        initialHasMore={reviewsResult.pagination.hasMore}
        title="Client Reviews"
        description="Recent ratings from families who trust YourHomeCare with care at home."
      />
      <LatestArticles
        heading={{
          badge: "Resource Center",
          title: "Guides for healthier living at home",
          description: "Human-centered articles on nutrition, safety, and everyday care.",
        }}
        posts={toBlogPostItems(blogPosts)}
      />
      <CallToAction />
    </>
  );
}
