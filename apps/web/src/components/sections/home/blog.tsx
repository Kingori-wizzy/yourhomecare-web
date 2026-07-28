import { CalendarDays } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

import Image from "next/image";
import Link from "next/link";

import { blogContent } from "@/content/blog";
import type { BlogPostItem, PageHero } from "@/server/cms";

interface LatestArticlesProps {
  heading?: PageHero;
  posts?: BlogPostItem[];
}

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
  featuredImage: post.featuredImage,
  authorName: post.author,
}));

export function LatestArticles({ heading = blogContent.hero, posts = DEFAULT_POSTS }: LatestArticlesProps) {
  return (
    <Section className="bg-white">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-semibold uppercase tracking-widest text-primary">
            {heading.badge}
          </p>

          <h2 className="mt-4 text-4xl font-bold">
            {heading.title}
          </h2>

          <p className="mt-6 text-lg text-muted-foreground">
            {heading.description}
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {posts.slice(0, 3).map((article) => (
            <article
              key={article.title}
              className="overflow-hidden rounded-3xl border bg-slate-50 transition hover:shadow-lg"
            >
              {article.featuredImage && (
                <div className="relative h-48 w-full">
                  <Image
                    src={article.featuredImage}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="p-8">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                {article.category}
              </span>

              <h3 className="mt-6 text-2xl font-semibold">
                {article.slug ? (
                  <Link href={`/blog/${article.slug}`} className="hover:text-primary">
                    {article.title}
                  </Link>
                ) : (
                  article.title
                )}
              </h3>

              <p className="mt-4 text-sm leading-7 text-muted-foreground">{article.excerpt}</p>

              <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays size={16} />
                {article.date}
              </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}