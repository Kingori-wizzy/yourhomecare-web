import { Hero } from "@/components/sections/home/hero";
import { Services } from "@/components/sections/home/services";
import { TrustSection } from "@/components/sections/home/trust";
import { Testimonials } from "@/components/sections/home/testimonials";
import { LatestArticles } from "@/components/sections/home/blog";
import { CallToAction } from "@/components/sections/home/cta";
import { homeContent } from "@/content/home";

import {
  getPublishedBlogPosts,
  getPublishedTestimonials,
  toBlogPostItems,
  toTestimonialItems,
} from "@/server/cms";

export default async function HomePage() {
  const [testimonials, blogPosts] = await Promise.all([
    getPublishedTestimonials(),
    getPublishedBlogPosts(),
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
