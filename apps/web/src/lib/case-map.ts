/** Convert camelCase keys to snake_case for Supabase/Postgres column names. */
export function toSnakeCaseKeys<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) continue;
    const snake = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
    result[snake] = value;
  }
  return result;
}

/** Convert snake_case keys from DB rows to camelCase for TypeScript records. */
export function toCamelCaseKeys<T>(obj: Record<string, unknown>): T {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const camel = key.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());
    result[camel] = value;
  }
  return result as T;
}

export function mapRowsToCamel<T>(rows: Record<string, unknown>[] | null | undefined): T[] {
  if (!rows?.length) return [];
  return rows.map((row) => toCamelCaseKeys<T>(row));
}
