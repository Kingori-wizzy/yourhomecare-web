import Link from "next/link";
import { ArrowRight, CalendarDays, Search } from "lucide-react";

import { PageHero } from "@/components/common/page-hero";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { CallToAction } from "@/components/sections/home/cta";
import { buildMetadata } from "@/lib/metadata";
import { getPageContent, getPublishedBlogPosts, toBlogPostItems } from "@/server/cms";

export const metadata = buildMetadata({
  title: "Blog",
  description: "Read articles and resources on home healthcare, family support and recovery.",
  path: "/blog",
});

export default async function BlogPage() {
  const [content, posts] = await Promise.all([getPageContent("blog"), getPublishedBlogPosts()]);
  const items = toBlogPostItems(posts);
  const [featuredPost, ...restPosts] = items;
  const listPosts = restPosts.length ? restPosts : items;

  return (
    <>
      <PageHero
        badge={content.hero.badge || "Insights"}
        title={content.hero.title}
        description={content.hero.description}
        imageUrl="/images/flyers/professional-home-healthcare.png"
        primaryCta={{ label: "Find Care", href: "/appointments" }}
        secondaryCta={{ label: "Our Services", href: "/services" }}
        priority
      />

      <Section className="bg-white">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[1.6fr_0.8fr]">
            <div className="rounded-[8px] border border-border bg-[#f8f9ff] p-7 shadow-[var(--shadow-sm)] lg:p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <span className="inline-flex rounded-[8px] bg-secondary/12 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-secondary">
                    {content.featured.category}
                  </span>
                  <h2 className="mt-4 text-3xl font-bold tracking-tight text-primary">
                    {content.featured.headline}
                  </h2>
                  <p className="mt-4 text-lg leading-[1.6] text-muted-foreground">
                    {content.featured.description}
                  </p>
                </div>
                <Link href={featuredPost ? `/blog/${featuredPost.slug}` : "/contact"}>
                  <Button className="h-11 shrink-0 rounded-[8px] bg-secondary px-5 font-semibold text-white hover:bg-secondary/90">
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[8px] border border-border bg-white p-6 shadow-[var(--shadow-sm)]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/12 text-secondary">
                    <Search className="h-4 w-4" />
                  </div>
                  <h3 className="font-semibold text-primary">Search Articles</h3>
                </div>
                <div className="mt-4 rounded-[8px] border border-border bg-[#f8f9ff] px-4 py-3 text-sm text-muted-foreground">
                  Search functionality will be added as content grows.
                </div>
              </div>

              <div className="rounded-[8px] border border-border bg-[#f8f9ff] p-6 shadow-[var(--shadow-sm)]">
                <h3 className="text-xl font-semibold text-primary">Categories</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {content.categories.map((category) => (
                    <span
                      key={category}
                      className="rounded-[8px] bg-white px-3 py-2 text-sm font-medium text-primary shadow-[var(--shadow-sm)]"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {listPosts.map((post) => (
              <article
                key={post.slug}
                className="rounded-[8px] border border-border bg-[#f8f9ff] p-7 shadow-[var(--shadow-sm)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-md)]"
              >
                <span className="inline-flex rounded-[8px] bg-secondary/12 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-secondary">
                  {post.category}
                </span>
                <h3 className="mt-4 text-2xl font-bold text-primary">{post.title}</h3>
                <p className="mt-3 text-base leading-[1.6] text-muted-foreground">{post.excerpt}</p>
                <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    {post.date}
                    {post.readingTime ? ` · ${post.readingTime}` : ""}
                  </span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 font-semibold text-secondary transition hover:text-primary"
                  >
                    Read more <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <CallToAction />
    </>
  );
}
