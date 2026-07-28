import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Search } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
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

  return (
    <>
      <Section className="bg-slate-50">
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <p className="font-semibold uppercase tracking-[0.2em] text-primary">{content.hero.badge}</p>
            <h1 className="mt-4 text-4xl font-bold lg:text-5xl">{content.hero.title}</h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">{content.hero.description}</p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.6fr_0.8fr]">
            <div className="rounded-3xl border bg-white p-8 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">{content.featured.category}</p>
                  <h2 className="mt-2 text-3xl font-bold">{content.featured.headline}</h2>
                </div>
                <Link href={featuredPost ? `/blog/${featuredPost.slug}` : "/contact"}>
                  <Button size="lg">Read More</Button>
                </Link>
              </div>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">{content.featured.description}</p>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border bg-slate-50 p-6">
                <div className="flex items-center gap-3 text-primary">
                  <Search size={18} />
                  <h3 className="font-semibold">Search Articles</h3>
                </div>
                <div className="mt-4 rounded-2xl border bg-white px-4 py-3 text-sm text-slate-500">Search functionality will be added as content grows.</div>
              </div>

              <div className="rounded-3xl border bg-white p-6 shadow-sm">
                <h3 className="text-xl font-semibold">Categories</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {content.categories.map((category) => (
                    <span key={category} className="rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700">
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-2">
            {(restPosts.length ? restPosts : items).map((post) => (
              <article key={post.slug} className="overflow-hidden rounded-3xl border bg-white shadow-sm">
                {post.featuredImage && (
                  <div className="relative h-56 w-full">
                    <Image src={post.featuredImage} alt={post.title} fill className="object-cover" />
                  </div>
                )}
                <div className="p-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">{post.category}</p>
                  <h3 className="mt-4 text-2xl font-bold">{post.title}</h3>
                  <p className="mt-4 leading-8 text-muted-foreground">{post.excerpt}</p>
                  <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays size={16} />
                      {post.date}
                      {post.readingTime ? ` · ${post.readingTime}` : ""}
                    </span>
                    <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-2 font-semibold text-primary">
                      Read more <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
