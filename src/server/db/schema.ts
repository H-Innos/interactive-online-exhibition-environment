import { sql } from "drizzle-orm";
import {
  pgTableCreator,
  serial,
  timestamp,
  varchar,
  text,
  uniqueIndex,
  boolean,
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
    isPublished: boolean("is_published").default(false).notNull(),
    isArchived: boolean("is_archived").default(false).notNull(),
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
