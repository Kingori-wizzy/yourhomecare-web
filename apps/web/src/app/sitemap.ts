import { MetadataRoute } from "next";

import { getPublishedBlogPosts, getPublishedSolutions } from "@/server/cms";
import { siteConfig } from "@/config/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/solutions`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/technology`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/partners`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/testimonials`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/appointments`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/careers`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  const [solutions, blogPosts] = await Promise.all([getPublishedSolutions(), getPublishedBlogPosts()]);

  const solutionRoutes: MetadataRoute.Sitemap = solutions.map((solution) => ({
    url: `${baseUrl}/solutions/${solution.slug}`,
    lastModified: new Date(solution.updatedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...solutionRoutes, ...blogRoutes];
}
