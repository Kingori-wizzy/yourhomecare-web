import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { env } from "@/lib/env";
import { DatabaseUnavailableError } from "@/server/db-errors";

let anonClient: SupabaseClient | null = null;
let serviceClient: SupabaseClient | null = null;

const clientOptions = {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
};

/** Public/anon client for intentionally public server-side operations only. */
export function getSupabaseAnonClient(): SupabaseClient | null {
  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
    return null;
  }

  if (!anonClient) {
    anonClient = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, clientOptions);
  }

  return anonClient;
}

/** Service-role client for CMS/admin server operations. Never import in client components. */
export function getSupabaseServiceClient(): SupabaseClient | null {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }

  if (!serviceClient) {
    serviceClient = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, clientOptions);
  }

  return serviceClient;
}

/** @deprecated Prefer getSupabaseAnonClient or getSupabaseServiceClient. */
export function getSupabaseClient() {
  return getSupabaseAnonClient();
}

export function requireSupabaseAnonClient(tableName: string): SupabaseClient {
  const client = getSupabaseAnonClient();
  if (!client) {
    throw new DatabaseUnavailableError(
      tableName,
      "Configure SUPABASE_URL and SUPABASE_ANON_KEY.",
    );
  }
  return client;
}

export function requireSupabaseServiceClient(tableName: string): SupabaseClient {
  const client = getSupabaseServiceClient();
  if (!client) {
    throw new DatabaseUnavailableError(
      tableName,
      "Configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
  return client;
}
