import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";

import { blogContent } from "@/content/blog";
import type { BlogPostItem, PageHero } from "@/server/cms";

interface LatestArticlesProps {
  heading?: PageHero;
  posts?: BlogPostItem[];
}

const FEATURED = [
  {
    category: "Nutrition",
    image: "/images/home/resource-nutrition.jpg",
    fallbackSlug: "home-based-healthcare",
  },
  {
    category: "Safety",
    image: "/images/home/resource-safety.jpg",
    fallbackSlug: "preventing-falls",
  },
];

const DEFAULT_POSTS: BlogPostItem[] = blogContent.posts.map((post) => ({
  slug: post.slug,
  title: post.title,
  category: post.category,
  excerpt: post.excerpt,
  date: new Date(post.publishedAt).toLocaleDateString("en-KE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
  publishedAt: post.publishedAt,
  readingTime: post.readingTime,
  authorName: post.author,
}));

export function LatestArticles({
  heading = blogContent.hero,
  posts = DEFAULT_POSTS,
}: LatestArticlesProps) {
  const featured = FEATURED.map((item, index) => {
    const post = posts[index] ?? DEFAULT_POSTS[index];
    return {
      ...item,
      title: post?.title ?? "Care guidance for families",
      excerpt: post?.excerpt ?? "Practical guidance for safer, healthier care at home.",
      date: post?.date ?? "",
      slug: post?.slug ?? item.fallbackSlug,
    };
  });

  return (
    <Section className="bg-section">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
              Resource Center
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-primary lg:text-5xl">
              {heading.title}
            </h2>
            <p className="mt-4 text-lg leading-[1.6] text-muted-foreground">
              Human-centered guidance on nutrition, safety, and everyday care at home.
            </p>
          </div>
          <Link href="/blog">
            <Button
              variant="outline"
              className="h-11 rounded-[8px] border-primary text-primary hover:bg-primary hover:text-white"
            >
              View all articles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {featured.map((article) => (
            <article
              key={article.slug}
              className="overflow-hidden rounded-[8px] border border-border bg-white shadow-[var(--shadow-sm)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-md)]"
            >
              <div className="relative aspect-[16/9] w-full">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="p-7">
                <span className="inline-flex rounded-[8px] bg-secondary/12 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-secondary">
                  {article.category}
                </span>
                <h3 className="mt-4 text-2xl font-bold text-primary">
                  <Link href={`/blog/${article.slug}`} className="hover:text-secondary">
                    {article.title}
                  </Link>
                </h3>
                <p className="mt-3 text-base leading-[1.6] text-muted-foreground">
                  {article.excerpt}
                </p>
                {article.date ? (
                  <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                    {article.date}
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
