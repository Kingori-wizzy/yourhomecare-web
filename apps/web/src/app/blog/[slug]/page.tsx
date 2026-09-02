import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarDays, User } from "lucide-react";

import { PageHero } from "@/components/common/page-hero";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { CallToAction } from "@/components/sections/home/cta";
import { buildMetadata } from "@/lib/metadata";
import { getBlogPostBySlug } from "@/server/cms";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return buildMetadata({
      title: "Blog",
      description: "Read articles and resources on home healthcare, family support and recovery.",
      path: "/blog",
    });
  }

  return buildMetadata({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt || post.title,
    path: `/blog/${post.slug}`,
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-KE", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : new Date(post.createdAt).toLocaleDateString("en-KE", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

  const badge = post.tags?.[0] || "Insights";

  return (
    <>
      <PageHero
        badge={badge}
        title={post.title}
        description={
          post.excerpt ||
          "Practical guidance for families navigating home healthcare with confidence and care."
        }
        imageUrl="/images/home/resource-nutrition.jpg"
        primaryCta={{ label: "Find Care", href: "/appointments" }}
        secondaryCta={{ label: "Our Services", href: "/services" }}
        priority
      />

      <Section className="bg-white pt-4">
        <Container>
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-secondary transition hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          <div className="mb-6 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
            {post.authorName ? (
              <span className="inline-flex items-center gap-2">
                <User className="h-4 w-4 text-secondary" />
                {post.authorName}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-secondary" />
              {publishedDate}
            </span>
          </div>

          <div className="mx-auto max-w-3xl rounded-[8px] border border-border bg-[#f8f9ff] p-8 shadow-[var(--shadow-sm)] lg:p-10">
            <div className="space-y-6 text-lg leading-[1.6] text-primary/90">
              {post.content
                .split("\n")
                .filter(Boolean)
                .map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
            </div>
          </div>
        </Container>
      </Section>

      <CallToAction />
    </>
  );
}
