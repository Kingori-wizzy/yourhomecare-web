import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CalendarDays, User } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { buildMetadata } from "@/lib/metadata";
import { getBlogPostBySlug, getPublishedBlogPosts } from "@/server/cms";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getPublishedBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

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
    ? new Date(post.publishedAt).toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })
    : new Date(post.createdAt).toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" });

  return (
    <>
      <Section className="bg-slate-50">
        <Container>
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center gap-2 text-primary hover:underline"
          >
            <ArrowLeft size={18} />
            Back to Blog
          </Link>

          <div className="max-w-4xl">
            {post.tags && post.tags.length > 0 && (
              <p className="font-semibold uppercase tracking-widest text-primary">{post.tags[0]}</p>
            )}

            <h1 className="mt-4 text-4xl font-bold leading-tight lg:text-5xl">{post.title}</h1>

            <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-slate-500">
              {post.authorName && (
                <span className="inline-flex items-center gap-2">
                  <User size={16} />
                  {post.authorName}
                </span>
              )}
              <span className="inline-flex items-center gap-2">
                <CalendarDays size={16} />
                {publishedDate}
              </span>
            </div>
          </div>
        </Container>
      </Section>

      {post.featuredImageUrl && (
        <Container>
          <div className="relative -mt-10 aspect-[16/9] w-full overflow-hidden rounded-3xl shadow-lg">
            <Image src={post.featuredImageUrl} alt={post.title} fill className="object-cover" />
          </div>
        </Container>
      )}

      <Section>
        <Container>
          <div className="mx-auto max-w-3xl">
            {post.excerpt && (
              <p className="text-xl leading-9 text-muted-foreground">{post.excerpt}</p>
            )}

            <div className="prose prose-slate mt-8 max-w-none text-lg leading-8 text-slate-700">
              {post.content.split("\n").filter(Boolean).map((paragraph, index) => (
                <p key={index} className="mb-6">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
