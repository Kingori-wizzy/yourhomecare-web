import { Hero } from "@/components/sections/home/hero";
import { TrustStats } from "@/components/sections/home/trust-stats";
import { Partners } from "@/components/sections/home/partners";
import { Services } from "@/components/sections/home/services";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStats />
      <Partners />
      <Services />
    </>
  );
}