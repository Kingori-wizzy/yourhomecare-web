import { createAdminPublicPair, createCrudRepository, type BaseRecord } from "@/server/repositories";
import {
  CMS_ADMIN_REPOSITORY_OPTIONS,
  PORTAL_REPOSITORY_OPTIONS,
} from "@/server/cms-persistence";
import { listMemoryUsers } from "@/server/auth-store";

export interface PatientRecord extends BaseRecord {
  fullName: string;
  email?: string;
  phone?: string;
  address?: string;
  carePlan?: string;
  notes?: string;
  status?: string;
}

export interface AppointmentRecord extends BaseRecord {
  patientId?: string;
  title: string;
  scheduledAt: string;
  status: "scheduled" | "completed" | "cancelled" | "rescheduled";
  notes?: string;
}

export interface AssessmentRecord extends BaseRecord {
  fullName: string;
  email: string;
  phone?: string;
  patientName?: string;
  patientAge?: string;
  location?: string;
  service?: string;
  preferredDate?: string;
  preferredTime?: string;
  notes?: string;
  status: string;
}

export interface ReferralRecord extends BaseRecord {
  organization: string;
  contactName: string;
  email: string;
  phone?: string;
  patientName?: string;
  diagnosis?: string;
  service?: string;
  location?: string;
  notes?: string;
  status: "new" | "reviewed" | "accepted" | "declined";
}

export interface ContactRecord extends BaseRecord {
  fullName: string;
  email: string;
  phone?: string;
  category?: string;
  subject: string;
  message: string;
  status?: string;
}

export interface JobListingRecord extends BaseRecord {
  title: string;
  department?: string;
  location?: string;
  employmentType?: string;
  description: string;
  requirements?: string[];
  isOpen: boolean;
  displayOrder?: number;
}

export interface CareerRecord extends BaseRecord {
  jobId?: string;
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  experience?: string;
  coverLetter?: string;
  resumeUrl?: string;
  status: string;
}

export interface NewsletterRecord extends BaseRecord {
  email: string;
  name?: string;
  consent: boolean;
}

export interface BlogPostRecord extends BaseRecord {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImageUrl?: string;
  authorName?: string;
  tags?: string[];
  status?: string;
  published: boolean;
  publishedAt?: string;
  scheduledAt?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface PartnerRecord extends BaseRecord {
  name: string;
  description?: string;
  websiteUrl?: string;
  logoUrl?: string;
  category?: string;
  featured: boolean;
  visible?: boolean;
  displayOrder?: number;
}

export interface TestimonialRecord extends BaseRecord {
  author: string;
  role?: string;
  quote: string;
  photoUrl?: string;
  rating?: number;
  featured: boolean;
  approved?: boolean;
  visible?: boolean;
  displayOrder?: number;
}

export interface ServiceRecord extends BaseRecord {
  name: string;
  slug: string;
  description?: string;
  features?: string[];
  icon?: string;
  imageUrl?: string;
  bannerUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  visible: boolean;
  displayOrder?: number;
}

export interface SolutionRecord extends BaseRecord {
  title: string;
  slug: string;
  description?: string;
  features?: string[];
  icon?: string;
  imageUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  visible: boolean;
  displayOrder?: number;
}

export interface FaqRecord extends BaseRecord {
  question: string;
  answer: string;
  category: string;
  visible: boolean;
  displayOrder?: number;
}

export interface MediaRecord extends BaseRecord {
  name: string;
  url: string;
  publicId?: string;
  resourceType: string;
  mimeType?: string;
  size?: number;
  folder?: string;
  alt?: string;
  tags?: string[];
}

export interface TeamMemberRecord extends BaseRecord {
  fullName: string;
  title: string;
  rank?: string;
  biography?: string;
  department?: string;
  photoUrl?: string;
  displayOrder?: number;
  isActive: boolean;
}

export interface ClientReviewRecord extends BaseRecord {
  name: string;
  email?: string;
  rating: number;
  comment: string;
  status: "pending" | "approved" | "rejected";
  ipHash?: string;
}

export interface NotificationRecord extends BaseRecord {
  title: string;
  message: string;
  type: string;
  read: boolean;
  userId?: string;
}

export interface UserRecord extends BaseRecord {
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
  isActive: boolean;
  lastLoginAt?: string;
}

export interface PageContentRecord extends BaseRecord {
  pageKey: string;
  title?: string;
  sections: Record<string, unknown>;
  seo?: Record<string, unknown>;
  sectionVisibility?: Record<string, boolean>;
  displayOrder?: string[];
}

export interface SettingRecord extends BaseRecord {
  key: string;
  value: unknown;
}

export interface AnalyticsSummary {
  patients: number;
  appointments: number;
  assessments: number;
  referrals: number;
  contacts: number;
  careers: number;
  jobs: number;
  newsletters: number;
  blogPosts: number;
  partners: number;
  testimonials: number;
  media: number;
  team: number;
  reviews: number;
}

export interface AuditLogRecord extends BaseRecord {
  userId?: string | null;
  userEmail?: string | null;
  action: string;
  resource?: string | null;
  resourceId?: string | null;
  details?: Record<string, unknown> | null;
  ipAddress?: string | null;
}

const now = new Date().toISOString();

export const patientService = createCrudRepository<PatientRecord>([], {
  tableName: "patients",
  ...PORTAL_REPOSITORY_OPTIONS,
});

export const appointmentService = createCrudRepository<AppointmentRecord>([], {
  tableName: "appointments",
  ...PORTAL_REPOSITORY_OPTIONS,
});

export const assessmentService = createCrudRepository<AssessmentRecord>([], {
  tableName: "assessments",
  ...PORTAL_REPOSITORY_OPTIONS,
});

export const referralService = createCrudRepository<ReferralRecord>([], {
  tableName: "referrals",
  ...PORTAL_REPOSITORY_OPTIONS,
});

export const contactService = createCrudRepository<ContactRecord>([], {
  tableName: "contacts",
  ...PORTAL_REPOSITORY_OPTIONS,
});

const jobListings = createAdminPublicPair<JobListingRecord>("job_listings");
export const jobService = jobListings.admin;
export const jobPublicService = jobListings.public;

const careers = createAdminPublicPair<CareerRecord>("careers");
export const careersService = careers.admin;
export const careersPublicService = careers.public;

const newsletters = createAdminPublicPair<NewsletterRecord>("newsletters");
export const newsletterService = newsletters.admin;
export const newsletterPublicService = newsletters.public;

const blogPosts = createAdminPublicPair<BlogPostRecord>("blog_posts");
export const blogPostService = blogPosts.admin;
export const blogPostPublicService = blogPosts.public;

const partners = createAdminPublicPair<PartnerRecord>("partners");
export const partnerService = partners.admin;
export const partnerPublicService = partners.public;

const testimonials = createAdminPublicPair<TestimonialRecord>("testimonials");
export const testimonialService = testimonials.admin;
export const testimonialPublicService = testimonials.public;

const services = createAdminPublicPair<ServiceRecord>("services");
export const serviceService = services.admin;
export const servicePublicService = services.public;

const solutions = createAdminPublicPair<SolutionRecord>("solutions");
export const solutionService = solutions.admin;
export const solutionPublicService = solutions.public;

const faqs = createAdminPublicPair<FaqRecord>("faq_items");
export const faqService = faqs.admin;
export const faqPublicService = faqs.public;

const teamMembers = createAdminPublicPair<TeamMemberRecord>("team_members");
export const teamService = teamMembers.admin;
export const teamPublicService = teamMembers.public;

export const reviewService = createCrudRepository<ClientReviewRecord>([], {
  tableName: "client_reviews",
  ...CMS_ADMIN_REPOSITORY_OPTIONS,
});

export const mediaService = createCrudRepository<MediaRecord>([], {
  tableName: "media_assets",
  ...CMS_ADMIN_REPOSITORY_OPTIONS,
});

export const notificationService = createCrudRepository<NotificationRecord>([], {
  tableName: "notifications",
  ...CMS_ADMIN_REPOSITORY_OPTIONS,
});

const pageContents = createAdminPublicPair<PageContentRecord>("page_contents");
export const pageContentService = pageContents.admin;
export const pageContentPublicService = pageContents.public;

const siteSettings = createAdminPublicPair<SettingRecord>("site_settings");
export const settingsService = siteSettings.admin;
export const settingsPublicService = siteSettings.public;

export const auditLogService = createCrudRepository<AuditLogRecord>([], {
  tableName: "audit_logs",
  ...CMS_ADMIN_REPOSITORY_OPTIONS,
});

/** Portal user UI — real authentication uses Drizzle via auth-store.ts. */
export const userService = {
  list: async () => {
    const memory = listMemoryUsers().map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      isActive: u.isActive,
      createdAt: now,
      updatedAt: now,
      lastLoginAt: u.lastLoginAt ?? undefined,
    }));
    return memory as UserRecord[];
  },
  get: async (id: string) => {
    const all = await userService.list();
    return all.find((u) => u.id === id);
  },
  create: async (input: Omit<UserRecord, "id" | "createdAt" | "updatedAt">) => {
    const record: UserRecord = {
      ...input,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const { upsertMemoryUser } = await import("@/server/auth-store");
    upsertMemoryUser({
      id: record.id,
      name: record.name,
      email: record.email,
      role: record.role,
      isActive: record.isActive,
      passwordHash: null,
    });
    return record;
  },
  update: async (id: string, input: Partial<UserRecord>) => {
    const existing = await userService.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...input, updatedAt: new Date().toISOString() };
    const { upsertMemoryUser } = await import("@/server/auth-store");
    upsertMemoryUser({
      id: updated.id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      isActive: updated.isActive,
      passwordHash: null,
    });
    return updated;
  },
  remove: async (id: string) => {
    const existing = await userService.get(id);
    return Boolean(existing);
  },
};

export async function getDashboardMetrics(): Promise<AnalyticsSummary> {
  return {
    patients: (await patientService.list()).length,
    appointments: (await appointmentService.list()).length,
    assessments: (await assessmentService.list()).length,
    referrals: (await referralService.list()).length,
    contacts: (await contactService.list()).length,
    careers: (await careersService.list()).length,
    jobs: (await jobService.list()).length,
    newsletters: (await newsletterService.list()).length,
    blogPosts: (await blogPostService.list()).length,
    partners: (await partnerService.list()).length,
  testimonials: (await testimonialService.list()).length,
  media: (await mediaService.list()).length,
  team: (await teamService.list()).length,
  reviews: (await reviewService.list()).length,
  };
}

export const adminServiceRegistry = {
  patients: patientService,
  appointments: appointmentService,
  assessments: assessmentService,
  referrals: referralService,
  contacts: contactService,
  careers: careersService,
  jobs: jobService,
  newsletters: newsletterService,
  blog: blogPostService,
  partners: partnerService,
  testimonials: testimonialService,
  services: serviceService,
  solutions: solutionService,
  faq: faqService,
  team: teamService,
  reviews: reviewService,
  media: mediaService,
  notifications: notificationService,
  pages: pageContentService,
  settings: settingsService,
  users: userService,
  logs: auditLogService,
  analytics: {
    list: async () => [await getDashboardMetrics()],
    get: async () => getDashboardMetrics(),
    create: async () => getDashboardMetrics(),
    update: async () => getDashboardMetrics(),
    remove: async () => false,
  },
} as const;

export type AdminResource = keyof typeof adminServiceRegistry;
