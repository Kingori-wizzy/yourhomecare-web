import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { env } from "@/lib/env";

let client: SupabaseClient | null = null;

export function getSupabaseClient() {
  if (client) {
    return client;
  }

  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
    return null;
  }

  client = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
  return client;
}
