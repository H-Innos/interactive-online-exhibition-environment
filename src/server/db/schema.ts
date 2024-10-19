import { sql } from "drizzle-orm";
import {
  index,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
  text,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator(
  (name) => `interactive-online-exhibition-environment_${name}`
);

export const exhibitions = createTable(
  "post",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    description: text("description").default(""),
    coverImageUrl: varchar("cover_image_url", { length: 512 }).default(""),
    content: text("content").default(""),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  },
  (example) => ({
    nameIndex: uniqueIndex("name_unique_idx").on(example.name),
  })
);
