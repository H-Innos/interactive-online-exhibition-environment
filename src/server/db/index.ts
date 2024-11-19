import { sql } from "@vercel/postgres";
import postgres from "postgres";
import {
  drizzle as VercelDrizzle,
  type VercelPgQueryResultHKT,
  type VercelPgDatabase,
} from "drizzle-orm/vercel-postgres";
import {
  drizzle as LocalDrizzle,
  type PostgresJsQueryResultHKT,
  type PostgresJsDatabase,
} from "drizzle-orm/postgres-js";
import * as schema from "./schema";
import { type PgTransaction } from "drizzle-orm/pg-core";
import { type ExtractTablesWithRelations } from "drizzle-orm";

let db: VercelPgDatabase<typeof schema> | PostgresJsDatabase<typeof schema>;

if (process.env.NODE_ENV === "production") {
  db = VercelDrizzle(sql, { schema });
} else {
  const migrationClient = postgres(process.env.POSTGRES_URL!);
  db = LocalDrizzle(migrationClient, { schema });
}

export { db };

export type DrizzleClient = typeof db;
export type DrizzleTransaction =
  | PgTransaction<
      VercelPgQueryResultHKT,
      typeof schema,
      ExtractTablesWithRelations<typeof schema>
    >
  | PgTransaction<
      PostgresJsQueryResultHKT,
      typeof schema,
      ExtractTablesWithRelations<typeof schema>
    >;
