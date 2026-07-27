import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "@/server/schema";

const connectionString = process.env.DATABASE_URL;

export const db = connectionString
  ? drizzle(postgres(connectionString), { schema })
  : null;

export type AppDb = NonNullable<typeof db>;
