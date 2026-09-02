import { randomUUID } from "node:crypto";

import {
  getSupabaseAnonClient,
  getSupabaseServiceClient,
} from "@/lib/supabase";
import { mapRowsToCamel, toCamelCaseKeys, toSnakeCaseKeys } from "@/lib/case-map";
import { DatabaseUnavailableError, isStrictCmsPersistence } from "@/server/db-errors";

export interface BaseRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface CrudRepository<T extends BaseRecord> {
  list(): Promise<T[]>;
  get(id: string): Promise<T | undefined>;
  create(input: Omit<T, "id" | "createdAt" | "updatedAt">): Promise<T>;
  update(id: string, input: Partial<Omit<T, "id" | "createdAt" | "updatedAt">>): Promise<T | undefined>;
  remove(id: string): Promise<boolean>;
}

export type SupabaseClientAccess = "anon" | "service";

interface RepositoryOptions {
  tableName?: string;
  /** When true, production refuses in-memory fallback and surfaces DB errors. */
  requireDatabase?: boolean;
  /** Which Supabase client to use. Defaults to service role. */
  clientAccess?: SupabaseClientAccess;
}

function shouldRequireDatabase(options?: RepositoryOptions) {
  return Boolean(options?.requireDatabase && isStrictCmsPersistence());
}

function resolveSupabaseClient(options: RepositoryOptions | undefined, tableName: string, strict: boolean) {
  const access = options?.clientAccess ?? "service";

  if (access === "anon") {
    const client = getSupabaseAnonClient();
    if (!client && strict) {
      throw new DatabaseUnavailableError(tableName, "Configure SUPABASE_URL and SUPABASE_ANON_KEY.");
    }
    return client;
  }

  const client = getSupabaseServiceClient();
  if (!client && strict) {
    throw new DatabaseUnavailableError(
      tableName,
      "Configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }
  return client;
}

function assertDatabaseAvailable(
  client: ReturnType<typeof getSupabaseServiceClient>,
  tableName: string,
  strict: boolean,
) {
  if (!client && strict) {
    throw new DatabaseUnavailableError(tableName);
  }
}

function assertDatabaseOperation<T>(
  tableName: string,
  strict: boolean,
  result: { data: T | null; error: { message: string } | null },
): T {
  if (result.error) {
    if (strict) {
      throw new DatabaseUnavailableError(tableName, result.error.message);
    }
    return null as T;
  }

  if ((result.data === null || result.data === undefined) && strict) {
    throw new DatabaseUnavailableError(tableName, "Empty database response.");
  }

  return result.data as T;
}

export function createCrudRepository<T extends BaseRecord>(
  initialItems: T[] = [],
  options?: RepositoryOptions,
): CrudRepository<T> {
  const items = [...initialItems];
  const tableName = options?.tableName ?? "records";
  const strict = shouldRequireDatabase(options);

  return {
    list: async () => {
      const client = resolveSupabaseClient(options, tableName, strict);
      assertDatabaseAvailable(client, tableName, strict);

      if (client) {
        const result = await client.from(tableName).select("*");
        if (strict) {
          assertDatabaseOperation(tableName, strict, result);
          return mapRowsToCamel<T>(result.data as Record<string, unknown>[]);
        }
        if (!result.error && result.data) {
          return mapRowsToCamel<T>(result.data as Record<string, unknown>[]);
        }
      }

      return items.slice();
    },
    get: async (id) => {
      const client = resolveSupabaseClient(options, tableName, strict);
      assertDatabaseAvailable(client, tableName, strict);

      if (client) {
        const result = await client.from(tableName).select("*").eq("id", id).maybeSingle();
        if (strict) {
          if (result.error) {
            throw new DatabaseUnavailableError(tableName, result.error.message);
          }
          return result.data ? toCamelCaseKeys<T>(result.data as Record<string, unknown>) : undefined;
        }
        if (!result.error && result.data) {
          return toCamelCaseKeys<T>(result.data as Record<string, unknown>);
        }
      }

      return items.find((item) => item.id === id);
    },
    create: async (input) => {
      const now = new Date().toISOString();
      const record = {
        ...(input as T),
        id: randomUUID(),
        createdAt: now,
        updatedAt: now,
      } as T;

      const client = resolveSupabaseClient(options, tableName, strict);
      assertDatabaseAvailable(client, tableName, strict);

      if (client) {
        const payload = toSnakeCaseKeys(record as unknown as Record<string, unknown>);
        const result = await client.from(tableName).insert(payload).select().single();
        if (strict) {
          assertDatabaseOperation(tableName, strict, result);
          return toCamelCaseKeys<T>(result.data as Record<string, unknown>);
        }
        if (!result.error && result.data) {
          return toCamelCaseKeys<T>(result.data as Record<string, unknown>);
        }
      }

      if (strict) {
        throw new DatabaseUnavailableError(tableName);
      }

      items.push(record);
      return record;
    },
    update: async (id, input) => {
      const now = new Date().toISOString();

      const client = resolveSupabaseClient(options, tableName, strict);
      assertDatabaseAvailable(client, tableName, strict);

      if (client) {
        const payload = toSnakeCaseKeys({ ...input, updatedAt: now });
        const result = await client.from(tableName).update(payload).eq("id", id).select().single();
        if (strict) {
          if (result.error) {
            throw new DatabaseUnavailableError(tableName, result.error.message);
          }
          if (!result.data) return undefined;
          const updated = toCamelCaseKeys<T>(result.data as Record<string, unknown>);
          const index = items.findIndex((item) => item.id === id);
          if (index !== -1) items[index] = updated;
          return updated;
        }
        if (!result.error && result.data) {
          const updated = toCamelCaseKeys<T>(result.data as Record<string, unknown>);
          const index = items.findIndex((item) => item.id === id);
          if (index !== -1) items[index] = updated;
          return updated;
        }
      }

      const index = items.findIndex((item) => item.id === id);
      if (index !== -1) {
        const updated = {
          ...items[index],
          ...input,
          updatedAt: now,
        } as T;
        items[index] = updated;
        return updated;
      }

      if (strict) {
        throw new DatabaseUnavailableError(tableName);
      }

      return undefined;
    },
    remove: async (id) => {
      const client = resolveSupabaseClient(options, tableName, strict);
      assertDatabaseAvailable(client, tableName, strict);

      if (client) {
        const result = await client.from(tableName).delete().eq("id", id);
        if (strict) {
          if (result.error) {
            throw new DatabaseUnavailableError(tableName, result.error.message);
          }
          const index = items.findIndex((item) => item.id === id);
          if (index !== -1) items.splice(index, 1);
          return true;
        }
        if (!result.error) {
          const index = items.findIndex((item) => item.id === id);
          if (index !== -1) items.splice(index, 1);
          return true;
        }
      }

      const index = items.findIndex((item) => item.id === id);
      if (index !== -1) {
        items.splice(index, 1);
        return true;
      }

      if (strict) {
        throw new DatabaseUnavailableError(tableName);
      }

      return false;
    },
  };
}

function createAdminPublicPair<T extends BaseRecord>(tableName: string) {
  const base = { tableName, requireDatabase: true as const };
  return {
    admin: createCrudRepository<T>([], { ...base, clientAccess: "service" }),
    public: createCrudRepository<T>([], { ...base, clientAccess: "anon" }),
  };
}

export { createAdminPublicPair };
