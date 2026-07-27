import { Hero } from "@/components/sections/home/hero";
import { Partners } from "@/components/sections/home/partners";
import { AboutPreview } from "@/components/sections/home/about-preview";
import { Services } from "@/components/sections/home/services";
import { Solutions } from "@/components/sections/home/solutions";
import { Technology } from "@/components/sections/home/technology";
import { WhyChooseUs } from "@/components/sections/home/why-us";
import { CareProcess } from "@/components/sections/home/process";
import { Testimonials } from "@/components/sections/home/testimonials";
import { LatestArticles } from "@/components/sections/home/blog";
import { CallToAction } from "@/components/sections/home/cta";
import { NewsletterSection } from "@/components/sections/home/newsletter";

import {
  getPageContent,
  getPublishedBlogPosts,
  getPublishedPartners,
  getPublishedServices,
  getPublishedSolutions,
  getPublishedTestimonials,
  toBlogPostItems,
  toPartnerCategories,
  toServiceItems,
  toSolutionItems,
  toTestimonialItems,
} from "@/server/cms";

export default async function HomePage() {
  const [
    content,
    partnersPage,
    servicesPage,
    solutionsPage,
    technologyPage,
    services,
    solutions,
    testimonials,
    partners,
    blogPosts,
  ] = await Promise.all([
    getPageContent("home"),
    getPageContent("partners"),
    getPageContent("services"),
    getPageContent("solutions"),
    getPageContent("technology"),
    getPublishedServices(),
    getPublishedSolutions(),
    getPublishedTestimonials(),
    getPublishedPartners(),
    getPublishedBlogPosts(),
  ]);

  return (
    <>
      <Hero hero={content.hero} />

      <Partners hero={partnersPage.hero} categories={toPartnerCategories(partners)} />

      <AboutPreview content={content.aboutPreview} />

      <Services heading={servicesPage.hero} services={toServiceItems(services)} />

      <Solutions heading={solutionsPage.hero} solutions={toSolutionItems(solutions)} />

      <Technology content={technologyPage} />

      <WhyChooseUs content={content.whyUs} />

      <CareProcess content={content.process} />

      <Testimonials heading={content.testimonialsIntro} testimonials={toTestimonialItems(testimonials)} />

      <LatestArticles heading={content.blogIntro} posts={toBlogPostItems(blogPosts)} />

      <NewsletterSection />

      <CallToAction />
    </>
  );
}
