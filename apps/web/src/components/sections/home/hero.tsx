import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { HeroSearch } from "./hero-search";

import { homeContent } from "@/content/home";
import type { HomeSections } from "@/server/cms";

interface HeroProps {
  hero?: HomeSections["hero"];
}

export function Hero({ hero = homeContent.hero }: HeroProps) {
  return (
    <section className="relative isolate pb-16 pt-0">
      <div className="relative min-h-[78vh] w-full overflow-hidden lg:min-h-[88vh]">
        <Image
          src="/images/home/hero-caregiver-patient.jpg"
          alt="A Black caregiver supporting an elderly Black patient in a warm, sunlit home"
          fill
          priority
          className="object-cover object-[72%_center]"
          sizes="100vw"
        />

        {/* Navy readability gradient — left side */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#1a365d]/92 via-[#1a365d]/70 to-transparent"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#1a365d]/50 via-transparent to-[#1a365d]/25"
          aria-hidden
        />

        <Container className="relative z-10 flex min-h-[78vh] flex-col justify-center py-20 lg:min-h-[88vh] lg:py-28">
          <div className="max-w-xl fade-up">
            <p className="inline-flex items-center rounded-[8px] bg-white/15 px-3.5 py-1.5 text-sm font-semibold text-white backdrop-blur-sm">
              {hero.badge}
            </p>

            <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
              {hero.title}
            </h1>

            <p className="mt-5 max-w-lg text-lg leading-[1.6] text-white/90">
              {hero.description}
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link href={hero.primaryButton.href}>
                <Button
                  size="lg"
                  className="h-12 rounded-[8px] bg-secondary px-6 text-base font-semibold text-white hover:bg-secondary/90"
                >
                  {hero.primaryButton.text}
                </Button>
              </Link>
              <Link href={hero.secondaryButton.href}>
                <Button
                  size="lg"
                  className="h-12 rounded-[8px] border-2 border-white/80 bg-[#1a365d] px-6 text-base font-semibold text-white hover:bg-white hover:text-primary"
                >
                  {hero.secondaryButton.text}
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>

      {/* Floating search — overlaps next section */}
      <Container className="relative z-20 -mt-8 lg:-mt-10">
        <div className="fade-up" style={{ animationDelay: "120ms" }}>
          <HeroSearch />
        </div>
      </Container>
    </section>
  );
}
