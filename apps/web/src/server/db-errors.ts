export class DatabaseUnavailableError extends Error {
  constructor(tableName: string, cause?: string) {
    super(
      cause
        ? `Database unavailable for ${tableName}: ${cause}`
        : `Database unavailable for ${tableName}. Configure SUPABASE_URL, SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY.`,
    );
    this.name = "DatabaseUnavailableError";
  }
}

export function isProductionRuntime() {
  return process.env.NODE_ENV === "production";
}

/** Strict CMS persistence: production deploy with full Supabase configuration. */
export function isStrictCmsPersistence() {
  return (
    isProductionRuntime() &&
    Boolean(
      process.env.SUPABASE_URL &&
        process.env.SUPABASE_ANON_KEY &&
        process.env.SUPABASE_SERVICE_ROLE_KEY,
    )
  );
}
