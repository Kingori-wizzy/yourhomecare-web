import Link from "next/link";
import Image from "next/image";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { HeroSearch } from "@/components/sections/home/hero-search";

export interface PageHeroProps {
  badge: string;
  title: string;
  description: string;
  imageUrl?: string;
  imageAlt?: string;
  /** @deprecated Prefer primaryCta — kept for existing call sites */
  cta?: { label: string; href: string };
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  showSearch?: boolean;
  priority?: boolean;
}

const DEFAULT_IMAGE = "/images/home/hero-caregiver-patient.jpg";

/**
 * Shared inner-page hero (all pages except home).
 * Photo on the right, content on the left, navy gradient + teal arc + overlapping search.
 */
export function PageHero({
  badge,
  title,
  description,
  imageUrl = DEFAULT_IMAGE,
  imageAlt = "YourHomeCare caregiver supporting a patient at home",
  cta,
  primaryCta,
  secondaryCta,
  showSearch = true,
  priority = false,
}: PageHeroProps) {
  const primary = primaryCta ?? cta ?? { label: "Find Care", href: "/appointments" };
  const secondary = secondaryCta ?? { label: "Our Services", href: "/services" };

  return (
    <section className="relative isolate pb-14 pt-0 lg:pb-16">
      <div className="relative min-h-[64vh] w-full overflow-hidden lg:min-h-[72vh]">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          priority={priority}
          className="object-cover object-[70%_center]"
          sizes="100vw"
        />

        {/* Navy → transparent atmospheric overlay (left) */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#1a365d] via-[#1a365d]/78 to-transparent"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#1a365d]/45 via-transparent to-[#1a365d]/20"
          aria-hidden
        />

        {/* Soft teal arc — bottom left */}
        <div
          className="pointer-events-none absolute -bottom-[35%] -left-[18%] h-[70vw] w-[70vw] max-h-[720px] max-w-[720px] rounded-full"
          style={{ backgroundColor: "rgba(0, 128, 128, 0.05)" }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-[28%] -left-[12%] h-[52vw] w-[52vw] max-h-[520px] max-w-[520px] rounded-full border border-[#008080]/15"
          aria-hidden
        />

        <Container className="relative z-10 flex min-h-[64vh] flex-col justify-center py-16 lg:min-h-[72vh] lg:py-24">
          <div className="max-w-xl fade-up">
            <p className="inline-flex items-center rounded-full border border-white/20 bg-white/15 px-3.5 py-1.5 text-sm font-semibold text-white backdrop-blur-sm">
              {badge}
            </p>

            <h1 className="mt-6 text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[64px]">
              {title}
            </h1>

            <p className="mt-5 max-w-lg text-lg leading-[1.6] text-white/90">{description}</p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link href={primary.href}>
                <Button
                  size="lg"
                  className="h-12 rounded-[8px] bg-secondary px-6 text-base font-semibold text-white hover:bg-secondary/90"
                >
                  {primary.label}
                </Button>
              </Link>
              <Link href={secondary.href}>
                <Button
                  size="lg"
                  className="h-12 rounded-[8px] border-2 border-white/85 bg-transparent px-6 text-base font-semibold text-white hover:bg-white hover:text-primary"
                >
                  {secondary.label}
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>

      {showSearch ? (
        <Container className="relative z-20 -mt-8 lg:-mt-10">
          <div className="fade-up" style={{ animationDelay: "120ms" }}>
            <HeroSearch />
          </div>
        </Container>
      ) : null}
    </section>
  );
}
