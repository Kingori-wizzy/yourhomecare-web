import { CalendarDays } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

import { blogContent } from "@/content/blog";

export function LatestArticles() {
  return (
    <Section className="bg-white">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-semibold uppercase tracking-widest text-primary">
            {blogContent.hero.badge}
          </p>

          <h2 className="mt-4 text-4xl font-bold">
            {blogContent.hero.title}
          </h2>

          <p className="mt-6 text-lg text-muted-foreground">
            {blogContent.hero.description}
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {blogContent.posts.map((article) => (
            <article
              key={article.title}
              className="rounded-3xl border bg-slate-50 p-8 transition hover:shadow-lg"
            >
              <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                {article.category}
              </span>

              <h3 className="mt-6 text-2xl font-semibold">
                {article.title}
              </h3>

              <p className="mt-4 text-sm leading-7 text-muted-foreground">{article.excerpt}</p>

              <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays size={16} />
                {article.date}
              </div>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}