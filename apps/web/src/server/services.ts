import { createCrudRepository, type BaseRecord } from "@/server/repositories";
import { listMemoryAuditLogs, listMemoryUsers } from "@/server/auth-store";

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
}

const now = new Date().toISOString();

export const patientService = createCrudRepository<PatientRecord>(
  [
    {
      id: "patient-1",
      fullName: "Amina Wanjiku",
      email: "amina@example.com",
      phone: "+254-700-111-222",
      address: "Nairobi, Kenya",
      carePlan: "Daily visits and medication reminders",
      notes: "Prefers evening visits",
      status: "active",
      createdAt: now,
      updatedAt: now,
    },
  ],
  { tableName: "patients" }
);

export const appointmentService = createCrudRepository<AppointmentRecord>(
  [
    {
      id: "appointment-1",
      patientId: "patient-1",
      title: "Initial assessment",
      scheduledAt: now,
      status: "scheduled",
      notes: "Requires caregiver support",
      createdAt: now,
      updatedAt: now,
    },
  ],
  { tableName: "appointments" }
);

export const assessmentService = createCrudRepository<AssessmentRecord>([], {
  tableName: "assessments",
});

export const referralService = createCrudRepository<ReferralRecord>(
  [
    {
      id: "referral-1",
      organization: "Nairobi Hospital",
      contactName: "Dr. Mercy Otieno",
      email: "mercy@nairobihospital.org",
      phone: "+254-700-333-444",
      notes: "Requests home-based full recovery plan",
      status: "new",
      createdAt: now,
      updatedAt: now,
    },
  ],
  { tableName: "referrals" }
);

export const contactService = createCrudRepository<ContactRecord>([], {
  tableName: "contacts",
});

export const jobService = createCrudRepository<JobListingRecord>(
  [
    {
      id: "job-1",
      title: "Caregiver",
      department: "Clinical",
      location: "Nairobi",
      employmentType: "Full-time",
      description: "Provide compassionate in-home care and support.",
      requirements: ["Certificate in caregiving", "2+ years experience"],
      isOpen: true,
      displayOrder: 1,
      createdAt: now,
      updatedAt: now,
    },
  ],
  { tableName: "job_listings" }
);

export const careersService = createCrudRepository<CareerRecord>([], {
  tableName: "careers",
});

export const newsletterService = createCrudRepository<NewsletterRecord>([], {
  tableName: "newsletters",
});

export const blogPostService = createCrudRepository<BlogPostRecord>(
  [
    {
      id: "blog-1",
      title: "Home care planning essentials",
      slug: "home-care-planning-essentials",
      excerpt: "A practical checklist for planning safe home care support.",
      content: "This article covers planning, care coordination, and communication.",
      authorName: "YourHomeCare Team",
      published: true,
      status: "published",
      createdAt: now,
      updatedAt: now,
    },
  ],
  { tableName: "blog_posts" }
);

export const partnerService = createCrudRepository<PartnerRecord>(
  [
    {
      id: "partner-1",
      name: "Nairobi Hospital",
      description: "A trusted hospital network for patient referrals.",
      websiteUrl: "https://www.nairobihospital.org",
      featured: true,
      visible: true,
      displayOrder: 1,
      createdAt: now,
      updatedAt: now,
    },
  ],
  { tableName: "partners" }
);

export const testimonialService = createCrudRepository<TestimonialRecord>(
  [
    {
      id: "testimonial-1",
      author: "Sarah Njeri",
      role: "Family member",
      quote: "The care team helped our loved one recover comfortably at home.",
      rating: 5,
      featured: true,
      approved: true,
      visible: true,
      createdAt: now,
      updatedAt: now,
    },
  ],
  { tableName: "testimonials" }
);

export const serviceService = createCrudRepository<ServiceRecord>([], {
  tableName: "services",
});

export const solutionService = createCrudRepository<SolutionRecord>([], {
  tableName: "solutions",
});

export const faqService = createCrudRepository<FaqRecord>([], {
  tableName: "faq_items",
});

export const mediaService = createCrudRepository<MediaRecord>([], {
  tableName: "media_assets",
});

export const notificationService = createCrudRepository<NotificationRecord>([], {
  tableName: "notifications",
});

export const pageContentService = createCrudRepository<PageContentRecord>([], {
  tableName: "page_contents",
});

export const settingsService = createCrudRepository<SettingRecord>([], {
  tableName: "site_settings",
});

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

export const auditLogService = {
  list: async () => listMemoryAuditLogs(),
  get: async (id: string) => listMemoryAuditLogs().find((l) => l.id === id),
  create: async () => null,
  update: async () => null,
  remove: async () => false,
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
