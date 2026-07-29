import Image from "next/image";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

import { partnersContent } from "@/content/partners";
import type { PageHero, PartnerCategoryItem } from "@/server/cms";

interface PartnersProps {
  hero?: PageHero;
  categories?: PartnerCategoryItem[];
  showIntro?: boolean;
}

export function Partners({
  hero = partnersContent.hero,
  categories = partnersContent.categories,
  showIntro = true,
}: PartnersProps) {
  return (
    <Section className="bg-section">
      <Container>
        {showIntro ? (
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
              {hero.badge}
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-primary lg:text-5xl">
              {hero.title}
            </h2>
            <p className="mt-4 text-lg leading-[1.6] text-muted-foreground">{hero.description}</p>
          </div>
        ) : null}

        {categories.map((category, index) => (
          <div key={category.title} className={showIntro || index > 0 ? "mt-14" : "mt-2"}>
            <h3 className="mb-6 text-center text-xl font-bold text-primary lg:text-2xl">
              {category.title}
            </h3>

            <div className="grid gap-5 md:grid-cols-2">
              {category.partners.map((partner) => (
                <article
                  key={partner.name}
                  className="flex gap-4 rounded-[8px] border border-border bg-white/90 p-5 shadow-[var(--shadow-sm)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-md)] sm:gap-5 sm:p-6"
                >
                  <div className="flex h-20 w-28 shrink-0 items-center justify-center rounded-[8px] border border-border bg-[#f8f9ff] px-3 py-2 sm:h-24 sm:w-32">
                    <Image
                      src={partner.logo}
                      alt={`${partner.name} logo`}
                      width={140}
                      height={72}
                      className="max-h-14 w-auto max-w-full object-contain sm:max-h-16"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="text-lg font-bold text-primary">{partner.name}</h4>
                    <ul className="mt-2 space-y-1.5">
                      {(partner.comments ?? []).slice(0, 2).map((comment) => (
                        <li
                          key={comment}
                          className="text-sm leading-[1.55] text-muted-foreground before:mr-2 before:text-secondary before:content-['•']"
                        >
                          {comment}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </Container>
    </Section>
  );
}
