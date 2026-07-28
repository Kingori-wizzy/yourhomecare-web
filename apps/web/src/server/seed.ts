import {
  patientService,
  appointmentService,
  referralService,
  contactService,
  careersService,
  newsletterService,
  blogPostService,
  partnerService,
  testimonialService,
  pageContentService,
  settingsService,
  serviceService,
  solutionService,
  faqService,
  jobService,
  mediaService,
} from "@/server/services";
import {
  buildBlogSeedRecords,
  buildFaqSeedRecords,
  buildJobSeedRecords,
  buildMediaSeedRecords,
  buildPageContentSeedEntries,
  buildPartnerSeedRecords,
  buildServiceSeedRecords,
  buildSiteSettingsSeedEntries,
  buildSolutionSeedRecords,
  buildTestimonialSeedRecords,
} from "@/server/cms";

let seeded = false;
let seedingPromise: Promise<void> | null = null;

/**
 * Populates the in-memory / Supabase-backed CMS tables from the static
 * `content/*.ts` modules the very first time any CMS getter is called.
 * Safe to call repeatedly - each table is only seeded when it is empty.
 */
export async function ensureCmsSeeded(): Promise<void> {
  if (seeded) return;

  if (!seedingPromise) {
    seedingPromise = performSeed().finally(() => {
      seeded = true;
    });
  }

  return seedingPromise;
}

interface SeedableService {
  list: () => Promise<Array<{ id: string }>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  create: (input: any) => Promise<unknown>;
}

async function seedIfEmpty(service: SeedableService, records: unknown[]) {
  const existing = await service.list();
  if (existing.length > 0 || records.length === 0) return;

  await Promise.all(records.map((record) => service.create(record)));
}

async function performSeed(): Promise<void> {
  await Promise.all([
    seedIfEmpty(pageContentService, buildPageContentSeedEntries()),
    seedIfEmpty(settingsService, buildSiteSettingsSeedEntries()),
    seedIfEmpty(serviceService, buildServiceSeedRecords()),
    seedIfEmpty(solutionService, buildSolutionSeedRecords()),
    seedIfEmpty(faqService, buildFaqSeedRecords()),
    seedIfEmpty(testimonialService, buildTestimonialSeedRecords()),
    seedIfEmpty(partnerService, buildPartnerSeedRecords()),
    seedIfEmpty(jobService, buildJobSeedRecords()),
    seedIfEmpty(blogPostService, buildBlogSeedRecords()),
    seedIfEmpty(mediaService, buildMediaSeedRecords()),
  ]);
}

/** @deprecated kept for backwards compatibility - use `ensureCmsSeeded` instead. */
export function seedDemoData() {
  patientService.list();
  appointmentService.list();
  referralService.list();
  contactService.list();
  careersService.list();
  newsletterService.list();
  blogPostService.list();
  partnerService.list();
  testimonialService.list();
  void ensureCmsSeeded();
}
