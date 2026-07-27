import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
  "super_admin",
  "administrator",
  "operations",
  "hr",
  "marketing",
  "content_manager",
  "read_only",
  "admin",
  "care_manager",
  "staff",
  "patient",
]);

export const appointmentStatusEnum = pgEnum("appointment_status", [
  "scheduled",
  "completed",
  "cancelled",
  "rescheduled",
]);

export const referralStatusEnum = pgEnum("referral_status", [
  "new",
  "reviewed",
  "accepted",
  "declined",
]);

export const publishStatusEnum = pgEnum("publish_status", [
  "draft",
  "published",
  "scheduled",
  "archived",
]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash"),
  role: userRoleEnum("role").notNull().default("read_only"),
  avatarUrl: varchar("avatar_url", { length: 500 }),
  isActive: boolean("is_active").notNull().default(true),
  failedLoginAttempts: integer("failed_login_attempts").notNull().default(0),
  lockedUntil: timestamp("locked_until", { withTimezone: true }),
  rememberToken: varchar("remember_token", { length: 255 }),
  resetToken: varchar("reset_token", { length: 255 }),
  resetTokenExpires: timestamp("reset_token_expires", { withTimezone: true }),
  twoFactorSecret: varchar("two_factor_secret", { length: 255 }),
  twoFactorEnabled: boolean("two_factor_enabled").notNull().default(false),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const patients = pgTable("patients", {
  id: uuid("id").primaryKey().defaultRandom(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  address: text("address"),
  carePlan: text("care_plan"),
  notes: text("notes"),
  status: varchar("status", { length: 50 }).notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const appointments = pgTable("appointments", {
  id: uuid("id").primaryKey().defaultRandom(),
  patientId: uuid("patient_id").references(() => patients.id),
  title: varchar("title", { length: 255 }).notNull(),
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }).notNull(),
  status: appointmentStatusEnum("status").notNull().default("scheduled"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const assessments = pgTable("assessments", {
  id: uuid("id").primaryKey().defaultRandom(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  patientName: varchar("patient_name", { length: 255 }),
  patientAge: varchar("patient_age", { length: 50 }),
  location: varchar("location", { length: 255 }),
  service: varchar("service", { length: 255 }),
  preferredDate: varchar("preferred_date", { length: 50 }),
  preferredTime: varchar("preferred_time", { length: 50 }),
  notes: text("notes"),
  status: varchar("status", { length: 50 }).notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const referrals = pgTable("referrals", {
  id: uuid("id").primaryKey().defaultRandom(),
  organization: varchar("organization", { length: 255 }).notNull(),
  contactName: varchar("contact_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  patientName: varchar("patient_name", { length: 255 }),
  diagnosis: text("diagnosis"),
  service: varchar("service", { length: 255 }),
  location: varchar("location", { length: 255 }),
  notes: text("notes"),
  status: referralStatusEnum("status").notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const contacts = pgTable("contacts", {
  id: uuid("id").primaryKey().defaultRandom(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  category: varchar("category", { length: 100 }),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const jobListings = pgTable("job_listings", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  department: varchar("department", { length: 255 }),
  location: varchar("location", { length: 255 }),
  employmentType: varchar("employment_type", { length: 100 }),
  description: text("description").notNull(),
  requirements: jsonb("requirements").$type<string[]>().default([]),
  isOpen: boolean("is_open").notNull().default(true),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const careers = pgTable("careers", {
  id: uuid("id").primaryKey().defaultRandom(),
  jobId: uuid("job_id").references(() => jobListings.id),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  role: varchar("role", { length: 255 }).notNull(),
  experience: varchar("experience", { length: 255 }),
  coverLetter: text("cover_letter"),
  resumeUrl: varchar("resume_url", { length: 500 }),
  status: varchar("status", { length: 50 }).notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const newsletters = pgTable("newsletters", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  consent: boolean("consent").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const blogCategories = pgTable("blog_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  featuredImageUrl: varchar("featured_image_url", { length: 500 }),
  authorName: varchar("author_name", { length: 255 }),
  categoryId: uuid("category_id").references(() => blogCategories.id),
  tags: jsonb("tags").$type<string[]>().default([]),
  status: publishStatusEnum("status").notNull().default("draft"),
  published: boolean("published").notNull().default(false),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
  seoTitle: varchar("seo_title", { length: 255 }),
  seoDescription: text("seo_description"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const partners = pgTable("partners", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  websiteUrl: varchar("website_url", { length: 500 }),
  logoUrl: varchar("logo_url", { length: 500 }),
  category: varchar("category", { length: 100 }),
  featured: boolean("featured").notNull().default(false),
  visible: boolean("visible").notNull().default(true),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const testimonials = pgTable("testimonials", {
  id: uuid("id").primaryKey().defaultRandom(),
  author: varchar("author", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }),
  quote: text("quote").notNull(),
  photoUrl: varchar("photo_url", { length: 500 }),
  rating: integer("rating").default(5),
  featured: boolean("featured").notNull().default(false),
  approved: boolean("approved").notNull().default(false),
  visible: boolean("visible").notNull().default(true),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const services = pgTable("services", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  features: jsonb("features").$type<string[]>().default([]),
  icon: varchar("icon", { length: 100 }),
  imageUrl: varchar("image_url", { length: 500 }),
  bannerUrl: varchar("banner_url", { length: 500 }),
  seoTitle: varchar("seo_title", { length: 255 }),
  seoDescription: text("seo_description"),
  visible: boolean("visible").notNull().default(true),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const solutions = pgTable("solutions", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  features: jsonb("features").$type<string[]>().default([]),
  icon: varchar("icon", { length: 100 }),
  imageUrl: varchar("image_url", { length: 500 }),
  seoTitle: varchar("seo_title", { length: 255 }),
  seoDescription: text("seo_description"),
  visible: boolean("visible").notNull().default(true),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const faqItems = pgTable("faq_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: varchar("category", { length: 100 }).notNull().default("General"),
  visible: boolean("visible").notNull().default(true),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const mediaAssets = pgTable("media_assets", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  url: varchar("url", { length: 1000 }).notNull(),
  publicId: varchar("public_id", { length: 500 }),
  resourceType: varchar("resource_type", { length: 50 }).notNull().default("image"),
  mimeType: varchar("mime_type", { length: 100 }),
  size: integer("size"),
  folder: varchar("folder", { length: 255 }).default("yourhomecare"),
  alt: varchar("alt", { length: 255 }),
  tags: jsonb("tags").$type<string[]>().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const siteSettings = pgTable("site_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const pageContents = pgTable("page_contents", {
  id: uuid("id").primaryKey().defaultRandom(),
  pageKey: varchar("page_key", { length: 100 }).notNull().unique(),
  title: varchar("title", { length: 255 }),
  sections: jsonb("sections").notNull().default({}),
  seo: jsonb("seo").$type<Record<string, unknown>>().default({}),
  sectionVisibility: jsonb("section_visibility").$type<Record<string, boolean>>().default({}),
  displayOrder: jsonb("display_order").$type<string[]>().default([]),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const analyticsEvents = pgTable("analytics_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventName: varchar("event_name", { length: 255 }).notNull(),
  userId: uuid("user_id"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id"),
  userEmail: varchar("user_email", { length: 255 }),
  action: varchar("action", { length: 100 }).notNull(),
  resource: varchar("resource", { length: 100 }),
  resourceId: varchar("resource_id", { length: 100 }),
  details: jsonb("details"),
  ipAddress: varchar("ip_address", { length: 100 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  type: varchar("type", { length: 50 }).notNull().default("info"),
  read: boolean("read").notNull().default(false),
  userId: uuid("user_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type MediaAsset = typeof mediaAssets.$inferSelect;
export type SiteSetting = typeof siteSettings.$inferSelect;
export type PageContent = typeof pageContents.$inferSelect;
