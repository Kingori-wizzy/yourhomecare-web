import { randomUUID } from "node:crypto";

import { getSupabaseClient } from "@/lib/supabase";

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

export function createCrudRepository<T extends BaseRecord>(initialItems: T[] = [], options?: { tableName?: string }): CrudRepository<T> {
  const items = [...initialItems];
  const tableName = options?.tableName ?? "records";
  const client = getSupabaseClient();

  return {
    list: async () => {
      if (client) {
        const { data, error } = await client.from(tableName).select("*");
        if (!error && data) {
          return data as T[];
        }
      }

      return items.slice();
    },
    get: async (id) => {
      if (client) {
        const { data, error } = await client.from(tableName).select("*").eq("id", id).maybeSingle();
        if (!error && data) {
          return data as T;
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

      if (client) {
        const { data, error } = await client.from(tableName).insert(record).select().single();
        if (!error && data) {
          return data as T;
        }
      }

      items.push(record);
      return record;
    },
    update: async (id, input) => {
      const index = items.findIndex((item) => item.id === id);
      if (index !== -1) {
        const updated = {
          ...items[index],
          ...input,
          updatedAt: new Date().toISOString(),
        } as T;
        items[index] = updated;
        return updated;
      }

      if (client) {
        const { data, error } = await client.from(tableName).update({ ...input, updatedAt: new Date().toISOString() }).eq("id", id).select().single();
        if (!error && data) {
          return data as T;
        }
      }

      return undefined;
    },
    remove: async (id) => {
      const index = items.findIndex((item) => item.id === id);
      if (index !== -1) {
        items.splice(index, 1);
        return true;
      }

      if (client) {
        const { error } = await client.from(tableName).delete().eq("id", id);
        if (!error) {
          return true;
        }
      }

      return false;
    },
  };
}
