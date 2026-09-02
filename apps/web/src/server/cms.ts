import {
  blogPostPublicService,
  faqPublicService,
  jobPublicService,
  pageContentPublicService,
  partnerPublicService,
  servicePublicService,
  settingsPublicService,
  solutionPublicService,
  teamPublicService,
  testimonialPublicService,
  type ServiceRecord,
  type SolutionRecord,
  type FaqRecord,
  type TestimonialRecord,
  type PartnerRecord,
  type JobListingRecord,
  type BlogPostRecord,
  type MediaRecord,
  type TeamMemberRecord,
} from "@/server/services";
import type { PublicReviewRecord } from "@/server/review-public";
import { listPublicApprovedReviews } from "@/server/review-public";
import { ensureCmsSeeded } from "@/server/seed";
import { DatabaseUnavailableError, isStrictCmsPersistence } from "@/server/db-errors";

import { siteConfig } from "@/config/site";
import { company } from "@/content/company";
import { socials } from "@/content/socials";
import { homeContent } from "@/content/home";
import { aboutContent } from "@/content/about";
import { servicesContent } from "@/content/services";
import { solutionsContent } from "@/content/solutions";
import { technologyContent } from "@/content/technology";
import { contactContent } from "@/content/contact";
import { careersContent } from "@/content/careers";
import { faqContent } from "@/content/faq";
import { blogContent } from "@/content/blog";
import { testimonialsContent } from "@/content/testimonials";
import { partnersContent } from "@/content/partners";
import { whyUsContent } from "@/content/why-us";
import { processContent } from "@/content/process";

/* -------------------------------------------------------------------------- */
/*  Shared helpers                                                            */
/* -------------------------------------------------------------------------- */

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function deepMerge<T>(base: T, override: unknown): T {
  if (!isPlainObject(override)) {
    return base;
  }

  if (!isPlainObject(base)) {
    return override as T;
  }

  const result: Record<string, unknown> = { ...(base as Record<string, unknown>) };

  for (const [key, value] of Object.entries(override)) {
    if (value === undefined) continue;

    const baseValue = (base as Record<string, unknown>)[key];

    if (isPlainObject(value) && isPlainObject(baseValue)) {
      result[key] = deepMerge(baseValue, value);
    } else {
      result[key] = value;
    }
  }

  return result as T;
}

function sortByDisplayOrder<T extends { displayOrder?: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
}

function withFallbackRecord<T extends Record<string, unknown>>(
  input: T,
  prefix: string,
  index: number
): T & { id: string; createdAt: string; updatedAt: string } {
  const now = new Date().toISOString();
  return { ...input, id: `${prefix}-fallback-${index}`, createdAt: now, updatedAt: now };
}

function resolveCatalogSource<T>(
  items: T[],
  seedRecords: Array<Record<string, unknown>>,
  prefix: string,
): T[] {
  if (items.length > 0) {
    return items;
  }

  if (isStrictCmsPersistence()) {
    return [];
  }

  return seedRecords.map((item, index) => withFallbackRecord(item, prefix, index)) as T[];
}

function rethrowDatabaseError(error: unknown) {
  if (error instanceof DatabaseUnavailableError) {
    throw error;
  }
}

/* -------------------------------------------------------------------------- */
/*  Page content sections                                                     */
/* -------------------------------------------------------------------------- */

export interface PageHero {
  badge: string;
  title: string;
  description: string;
  imageUrl?: string;
}

export interface HomeSections {
  hero: {
    badge: string;
    title: string;
    highlight: string;
    description: string;
    imageUrl?: string;
    primaryButton: { text: string; href: string };
    secondaryButton: { text: string; href: string };
    trust: string[];
  };
  whyUs: {
    badge: string;
    title: string;
    description: string;
    features: Array<{ title: string; description: string; icon: string }>;
  };
  process: {
    badge: string;
    title: string;
    description: string;
    steps: Array<{ number: string; title: string; description: string; icon: string }>;
  };
  aboutPreview: {
    badge: string;
    title: string;
    paragraphs: string[];
    values: string[];
  };
  testimonialsIntro: PageHero;
  blogIntro: PageHero;
}

export interface AboutSections {
  hero: PageHero;
  story: { title: string; paragraphs: string[] };
  mission: string;
  vision: string;
  values: string[];
  impact: Array<{ value: string; label: string }>;
}

export interface ServicesSections {
  hero: PageHero;
}

export interface SolutionsSections {
  hero: PageHero;
}

export interface TechnologySections {
  hero: PageHero;
  introduction: { title: string; description: string };
  features: string[];
  benefits: Array<{ title: string; description: string }>;
  security: string[];
}

export interface ContactSections {
  hero: PageHero;
  information: { phone: string; email: string; address: string; hours: string[] };
  emergency: string;
  cta: { title: string; description: string; buttons: Array<{ label: string; href: string }> };
}

export interface CareersSections {
  hero: PageHero;
  benefits: string[];
  culture: string[];
}

export interface FaqSections {
  hero: PageHero;
}

export interface BlogSections {
  hero: PageHero;
  featured: { category: string; headline: string; description: string };
  categories: string[];
}

export interface PartnersSections {
  hero: PageHero;
}

export interface TestimonialsSections {
  badge: string;
  title: string;
  description: string;
}

interface PageSectionsMap {
  home: HomeSections;
  about: AboutSections;
  services: ServicesSections;
  solutions: SolutionsSections;
  technology: TechnologySections;
  contact: ContactSections;
  careers: CareersSections;
  faq: FaqSections;
  blog: BlogSections;
  partners: PartnersSections;
  testimonials: TestimonialsSections;
}

export type PageKey = keyof PageSectionsMap;

export const PAGE_KEYS: PageKey[] = [
  "home",
  "about",
  "services",
  "solutions",
  "technology",
  "contact",
  "careers",
  "faq",
  "blog",
  "partners",
  "testimonials",
];

const WHY_US_ICON_NAMES = [
  "ShieldCheck",
  "FileHeart",
  "MonitorSmartphone",
  "Clock3",
  "MapPinned",
  "Users",
  "Handshake",
  "HeartHandshake",
];

const PROCESS_ICON_NAMES = ["PhoneCall", "ClipboardCheck", "House", "HeartHandshake"];

function buildHomeDefaults(): HomeSections {
  return {
    hero: { ...homeContent.hero },
    whyUs: {
      badge: whyUsContent.badge,
      title: whyUsContent.title,
      description: whyUsContent.description,
      features: whyUsContent.features.map((feature, index) => ({
        title: feature.title,
        description: feature.description,
        icon: WHY_US_ICON_NAMES[index] ?? "ShieldCheck",
      })),
    },
    process: {
      badge: processContent.badge,
      title: processContent.title,
      description: processContent.description,
      steps: processContent.steps.map((step, index) => ({
        number: step.number,
        title: step.title,
        description: step.description,
        icon: PROCESS_ICON_NAMES[index] ?? "PhoneCall",
      })),
    },
    aboutPreview: {
      badge: aboutContent.hero.badge,
      title: aboutContent.hero.title,
      paragraphs: aboutContent.story.paragraphs.slice(0, 2),
      values: aboutContent.values,
    },
    testimonialsIntro: {
      badge: testimonialsContent.badge,
      title: testimonialsContent.title,
      description: testimonialsContent.description,
    },
    blogIntro: { ...blogContent.hero },
  };
}

function buildAboutDefaults(): AboutSections {
  return {
    hero: { ...aboutContent.hero },
    story: { title: aboutContent.story.title, paragraphs: [...aboutContent.story.paragraphs] },
    mission: aboutContent.mission,
    vision: aboutContent.vision,
    values: [...aboutContent.values],
    impact: aboutContent.impact.map((item) => ({ ...item })),
  };
}

function buildServicesDefaults(): ServicesSections {
  return { hero: { ...servicesContent.hero } };
}

function buildSolutionsDefaults(): SolutionsSections {
  return { hero: { ...solutionsContent.hero } };
}

function buildTechnologyDefaults(): TechnologySections {
  return {
    hero: { ...technologyContent.hero },
    introduction: { ...technologyContent.introduction },
    features: [...technologyContent.features],
    benefits: technologyContent.benefits.map((item) => ({ ...item })),
    security: [...technologyContent.security],
  };
}

function buildContactDefaults(): ContactSections {
  return {
    hero: { ...contactContent.hero },
    information: {
      phone: contactContent.information.phone,
      email: contactContent.information.email,
      address: contactContent.information.address,
      hours: [...contactContent.information.hours],
    },
    emergency: contactContent.emergency,
    cta: {
      title: contactContent.cta.title,
      description: contactContent.cta.description,
      buttons: contactContent.cta.buttons.map((button) => ({ ...button })),
    },
  };
}

function buildCareersDefaults(): CareersSections {
  return {
    hero: { ...careersContent.hero },
    benefits: [...careersContent.benefits],
    culture: [...careersContent.culture],
  };
}

function buildFaqDefaults(): FaqSections {
  return { hero: { ...faqContent.hero } };
}

function buildBlogDefaults(): BlogSections {
  return {
    hero: { ...blogContent.hero },
    featured: { ...blogContent.featured },
    categories: [...blogContent.categories],
  };
}

function buildPartnersDefaults(): PartnersSections {
  return { hero: { ...partnersContent.hero } };
}

function buildTestimonialsDefaults(): TestimonialsSections {
  return {
    badge: testimonialsContent.badge,
    title: testimonialsContent.title,
    description: testimonialsContent.description,
  };
}

const PAGE_DEFAULT_BUILDERS: { [K in PageKey]: () => PageSectionsMap[K] } = {
  home: buildHomeDefaults,
  about: buildAboutDefaults,
  services: buildServicesDefaults,
  solutions: buildSolutionsDefaults,
  technology: buildTechnologyDefaults,
  contact: buildContactDefaults,
  careers: buildCareersDefaults,
  faq: buildFaqDefaults,
  blog: buildBlogDefaults,
  partners: buildPartnersDefaults,
  testimonials: buildTestimonialsDefaults,
};

export function getPageDefaults<K extends PageKey>(pageKey: K): PageSectionsMap[K] {
  return PAGE_DEFAULT_BUILDERS[pageKey]();
}

export function buildPageContentSeedEntries(): Array<{ pageKey: PageKey; title: string; sections: Record<string, unknown> }> {
  return PAGE_KEYS.map((pageKey) => ({
    pageKey,
    title: pageKey.charAt(0).toUpperCase() + pageKey.slice(1),
    sections: getPageDefaults(pageKey) as unknown as Record<string, unknown>,
  }));
}

export async function getPageContent<K extends PageKey>(pageKey: K): Promise<PageSectionsMap[K]> {
  await ensureCmsSeeded();

  const fallback = getPageDefaults(pageKey);

  try {
    const pages = await pageContentPublicService.list();
    const record = pages.find((page) => page.pageKey === pageKey);

    if (record?.sections && Object.keys(record.sections).length > 0) {
      return deepMerge(fallback, record.sections);
    }
  } catch (error) {
    rethrowDatabaseError(error);
    // Development-only: fall back to static defaults when DB is unavailable.
  }

  return fallback;
}

/* -------------------------------------------------------------------------- */
/*  Site settings                                                             */
/* -------------------------------------------------------------------------- */

export interface SiteSettings {
  branding: {
    name: string;
    tagline: string;
    description: string;
    logoUrl: string;
    darkLogoUrl: string;
    footerLogoUrl: string;
    faviconUrl: string;
  };
  contact: {
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
    hours: string[];
  };
  socials: Array<{ name: string; href: string; icon: string }>;
  seo: {
    keywords: string[];
    defaultTitle: string;
    defaultDescription: string;
    url: string;
  };
  analytics: {
    googleAnalyticsId?: string;
    facebookPixelId?: string;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    muted: string;
    text: string;
  };
}

export function buildSiteSettingsDefaults(): SiteSettings {
  return {
    branding: {
      name: company.name,
      tagline: company.tagline,
      description: siteConfig.description,
      logoUrl: "/branding/logo.png",
      darkLogoUrl: "/branding/logo.png",
      footerLogoUrl: "/branding/logo.png",
      faviconUrl: "/branding/logo.png",
    },
    contact: {
      phone: company.phone,
      whatsapp: siteConfig.whatsapp,
      email: company.email,
      address: company.address,
      hours: [...contactContent.information.hours],
    },
    socials: socials.map((social) => ({ ...social })),
    seo: {
      keywords: [...siteConfig.seo.keywords],
      defaultTitle: siteConfig.name,
      defaultDescription: siteConfig.description,
      url: siteConfig.url,
    },
    analytics: {},
    colors: {
      primary: "#0F6CBD",
      secondary: "#14B87A",
      accent: "#EAF6FF",
      background: "#F8FBFD",
      surface: "#FFFFFF",
      muted: "#F2F7FA",
      text: "#0F172A",
    },
  };
}

export function buildSiteSettingsSeedEntries(): Array<{ key: string; value: unknown }> {
  const defaults = buildSiteSettingsDefaults();

  return [
    { key: "branding", value: defaults.branding },
    { key: "contact", value: defaults.contact },
    { key: "socials", value: defaults.socials },
    { key: "seo", value: defaults.seo },
    { key: "analytics", value: defaults.analytics },
    { key: "colors", value: defaults.colors },
  ];
}

export async function getSiteSettings(): Promise<SiteSettings> {
  await ensureCmsSeeded();

  const fallback = buildSiteSettingsDefaults();

  try {
    const rows = await settingsPublicService.list();

    if (rows.length > 0) {
      const map = new Map(rows.map((row) => [row.key, row.value]));

      return {
        branding: deepMerge(fallback.branding, map.get("branding")),
        contact: deepMerge(fallback.contact, map.get("contact")),
        socials: Array.isArray(map.get("socials"))
          ? (map.get("socials") as SiteSettings["socials"])
          : fallback.socials,
        seo: deepMerge(fallback.seo, map.get("seo")),
        analytics: deepMerge(fallback.analytics, map.get("analytics")),
        colors: deepMerge(fallback.colors, map.get("colors")),
      };
    }
  } catch (error) {
    rethrowDatabaseError(error);
    // Development-only: fall back to static defaults when DB is unavailable.
  }

  return fallback;
}

/* -------------------------------------------------------------------------- */
/*  Catalog seed builders                                                     */
/* -------------------------------------------------------------------------- */

export function buildServiceSeedRecords(): Array<Omit<ServiceRecord, "id" | "createdAt" | "updatedAt">> {
  return servicesContent.services.map((service, index) => ({
    name: service.title,
    slug: slugify(service.title),
    description: service.description,
    features: [...service.features],
    icon: service.icon,
    visible: true,
    displayOrder: index,
  }));
}

export function buildSolutionSeedRecords(): Array<Omit<SolutionRecord, "id" | "createdAt" | "updatedAt">> {
  return solutionsContent.solutions.map((solution, index) => ({
    title: solution.title,
    slug: solution.slug,
    description: solution.description,
    features: [...solution.features],
    visible: true,
    displayOrder: index,
  }));
}

export function buildFaqSeedRecords(): Array<Omit<FaqRecord, "id" | "createdAt" | "updatedAt">> {
  return faqContent.items.map((item, index) => ({
    question: item.question,
    answer: item.answer,
    category: "General",
    visible: true,
    displayOrder: index,
  }));
}

export function buildTestimonialSeedRecords(): Array<Omit<TestimonialRecord, "id" | "createdAt" | "updatedAt">> {
  return testimonialsContent.testimonials.map((testimonial, index) => ({
    author: testimonial.name,
    role: testimonial.role,
    quote: testimonial.quote,
    rating: 5,
    featured: index === 0,
    approved: true,
    visible: true,
    displayOrder: index,
  }));
}

export function buildPartnerSeedRecords(): Array<Omit<PartnerRecord, "id" | "createdAt" | "updatedAt">> {
  const records: Array<Omit<PartnerRecord, "id" | "createdAt" | "updatedAt">> = [];
  let order = 0;

  for (const category of partnersContent.categories) {
    for (const partner of category.partners) {
      records.push({
        name: partner.name,
        logoUrl: partner.logo,
        description: partner.comments?.join("\n"),
        category: category.title,
        featured: false,
        visible: true,
        displayOrder: order,
      });
      order += 1;
    }
  }

  return records;
}

export function buildMediaSeedRecords(): Array<Omit<MediaRecord, "id" | "createdAt" | "updatedAt">> {
  const records: Array<Omit<MediaRecord, "id" | "createdAt" | "updatedAt">> = [];
  const branding = buildSiteSettingsDefaults().branding;

  records.push({
    name: "Site Logo",
    url: branding.logoUrl,
    resourceType: "image",
    mimeType: "image/png",
    folder: "branding",
    alt: `${branding.name} logo`,
    tags: ["branding", "logo"],
  });

  for (const category of partnersContent.categories) {
    for (const partner of category.partners) {
      records.push({
        name: `${partner.name} logo`,
        url: partner.logo,
        resourceType: "image",
        mimeType: "image/png",
        folder: "partners",
        alt: `${partner.name} logo`,
        tags: ["partner", category.title],
      });
    }
  }

  return records;
}

export function buildJobSeedRecords(): Array<Omit<JobListingRecord, "id" | "createdAt" | "updatedAt">> {
  return careersContent.positions.map((position, index) => ({
    title: position.title,
    location: position.location,
    employmentType: position.type,
    description: position.description,
    requirements: [],
    isOpen: true,
    displayOrder: index,
  }));
}

export function buildBlogSeedRecords(): Array<Omit<BlogPostRecord, "id" | "createdAt" | "updatedAt">> {
  return blogContent.posts.map((post) => ({
    title: post.title,
    slug: post.slug ?? slugify(post.title),
    excerpt: post.excerpt,
    content: post.content ?? post.excerpt,
    featuredImageUrl: post.featuredImage,
    authorName: post.author ?? "YourHomeCare Clinical Team",
    tags: [post.category, ...(post.tags ?? [])].filter(
      (tag, index, all) => all.indexOf(tag) === index
    ),
    status: "published",
    published: true,
    publishedAt: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription,
  }));
}

/* -------------------------------------------------------------------------- */
/*  Published catalog getters                                                 */
/* -------------------------------------------------------------------------- */

export async function getPublishedServices(): Promise<ServiceRecord[]> {
  await ensureCmsSeeded();

  const items = await servicePublicService.list();
  const source = resolveCatalogSource(items, buildServiceSeedRecords(), "service");

  return sortByDisplayOrder(source.filter((item) => item.visible !== false));
}

export async function getPublishedSolutions(): Promise<SolutionRecord[]> {
  await ensureCmsSeeded();

  const items = await solutionPublicService.list();
  const source = resolveCatalogSource(items, buildSolutionSeedRecords(), "solution");

  return sortByDisplayOrder(source.filter((item) => item.visible !== false));
}

export async function getPublishedFaqs(): Promise<FaqRecord[]> {
  await ensureCmsSeeded();

  const items = await faqPublicService.list();
  const source = resolveCatalogSource(items, buildFaqSeedRecords(), "faq");

  return sortByDisplayOrder(source.filter((item) => item.visible !== false));
}

export async function getPublishedTestimonials(): Promise<TestimonialRecord[]> {
  await ensureCmsSeeded();

  const items = await testimonialPublicService.list();
  const source = resolveCatalogSource(items, buildTestimonialSeedRecords(), "testimonial");

  return sortByDisplayOrder(
    source.filter((item) => item.visible !== false && item.approved !== false),
  );
}

export async function getPublishedTeamMembers(): Promise<TeamMemberRecord[]> {
  const items = await teamPublicService.list();
  return sortByDisplayOrder(
    items.filter((member) => member.isActive !== false),
  );
}

export async function getApprovedReviews(options?: { page?: number; pageSize?: number }) {
  return listPublicApprovedReviews(options);
}

export async function getPublishedPartners(): Promise<PartnerRecord[]> {
  await ensureCmsSeeded();

  const items = await partnerPublicService.list();
  const source = resolveCatalogSource(items, buildPartnerSeedRecords(), "partner");

  return sortByDisplayOrder(source.filter((item) => item.visible !== false));
}

export async function getPublishedJobs(): Promise<JobListingRecord[]> {
  await ensureCmsSeeded();

  const items = await jobPublicService.list();
  const source = resolveCatalogSource(items, buildJobSeedRecords(), "job");

  return sortByDisplayOrder(source.filter((item) => item.isOpen !== false));
}

export async function getPublishedBlogPosts(): Promise<BlogPostRecord[]> {
  await ensureCmsSeeded();

  const items = await blogPostPublicService.list();
  const source = resolveCatalogSource(items, buildBlogSeedRecords(), "blog");

  return source
    .filter((item) => item.published !== false)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostRecord | undefined> {
  const posts = await getPublishedBlogPosts();
  return posts.find((post) => post.slug === slug);
}

/* -------------------------------------------------------------------------- */
/*  View-model adapters                                                       */
/*  Keep section components decoupled from raw DB record shapes.              */
/* -------------------------------------------------------------------------- */

export interface ServiceItem {
  title: string;
  icon: string;
  description: string;
  features: string[];
}

export function toServiceItems(records: ServiceRecord[]): ServiceItem[] {
  return records.map((record) => ({
    title: record.name,
    icon: record.icon ?? "HeartPulse",
    description: record.description ?? "",
    features: record.features ?? [],
  }));
}

export interface SolutionItem {
  slug: string;
  title: string;
  description: string;
  features: string[];
}

export function toSolutionItems(records: SolutionRecord[]): SolutionItem[] {
  return records.map((record) => ({
    slug: record.slug,
    title: record.title,
    description: record.description ?? "",
    features: record.features ?? [],
  }));
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function toFaqItems(records: FaqRecord[]): FaqItem[] {
  return records.map((record) => ({ question: record.question, answer: record.answer }));
}

export interface TestimonialItem {
  name: string;
  role: string;
  quote: string;
  rating: number;
}

export function toTestimonialItems(records: TestimonialRecord[]): TestimonialItem[] {
  return records.map((record) => ({
    name: record.author,
    role: record.role ?? "",
    quote: record.quote,
    rating: record.rating ?? 5,
  }));
}

export interface TeamMemberItem {
  id: string;
  fullName: string;
  title: string;
  rank?: string;
  biography?: string;
  department?: string;
  photoUrl?: string;
}

export function toTeamMemberItems(records: TeamMemberRecord[]): TeamMemberItem[] {
  return records.map((record) => ({
    id: record.id,
    fullName: record.fullName,
    title: record.title,
    rank: record.rank,
    biography: record.biography,
    department: record.department,
    photoUrl: record.photoUrl,
  }));
}

export interface ReviewItem {
  id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export function toReviewItems(records: Array<Pick<PublicReviewRecord, "id" | "name" | "rating" | "comment" | "createdAt">>): ReviewItem[] {
  return records.map((record) => ({
    id: record.id,
    name: record.name,
    rating: record.rating,
    comment: record.comment,
    createdAt: record.createdAt,
  }));
}

export interface PartnerCategoryItem {
  title: string;
  partners: Array<{ name: string; logo: string; comments?: string[] }>;
}

export function toPartnerCategories(records: PartnerRecord[]): PartnerCategoryItem[] {
  const order: string[] = [];
  const groups = new Map<string, Array<{ name: string; logo: string; comments?: string[] }>>();
  const contentByName = isStrictCmsPersistence()
    ? new Map<string, { logo?: string; comments?: string[] }>()
    : new Map(
        partnersContent.categories.flatMap((category) =>
          category.partners.map((partner) => [partner.name.toLowerCase(), partner] as const),
        ),
      );

  for (const record of records) {
    const category = record.category ?? "Partners";

    if (!groups.has(category)) {
      groups.set(category, []);
      order.push(category);
    }

    const fromContent = contentByName.get(record.name.toLowerCase());
    const comments =
      fromContent?.comments ??
      (record.description
        ? record.description
            .split(/\n+/)
            .map((line) => line.trim())
            .filter(Boolean)
            .slice(0, 2)
        : undefined);

    groups.get(category)?.push({
      name: record.name,
      logo: record.logoUrl ?? fromContent?.logo ?? "/branding/logo.png",
      comments,
    });
  }

  return order.map((title) => ({ title, partners: groups.get(title) ?? [] }));
}

export interface JobItem {
  title: string;
  location: string;
  type: string;
  description: string;
}

export function toJobItems(records: JobListingRecord[]): JobItem[] {
  return records.map((record) => ({
    title: record.title,
    location: record.location ?? "",
    type: record.employmentType ?? "Full-time",
    description: record.description,
  }));
}

export interface BlogPostItem {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  publishedAt?: string;
  readingTime: string;
  featuredImage?: string;
  authorName?: string;
}

function estimateReadingTime(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

export function toBlogPostItems(records: BlogPostRecord[]): BlogPostItem[] {
  return records.map((record) => ({
    slug: record.slug,
    title: record.title,
    category: record.tags?.[0] ?? "Home Care",
    excerpt: record.excerpt ?? "",
    date: record.publishedAt
      ? new Date(record.publishedAt).toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })
      : "Coming Soon",
    publishedAt: record.publishedAt,
    readingTime: estimateReadingTime(record.content ?? ""),
    featuredImage: record.featuredImageUrl,
    authorName: record.authorName,
  }));
}
