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

export default function HomePage() {
  return (
    <>
      <Hero />

      <Partners />

      <AboutPreview />

      <Services />

      <Solutions />

      <Technology />

      <WhyChooseUs />

      <CareProcess />

      <Testimonials />

      <LatestArticles />

      <CallToAction />
    </>
  );
}