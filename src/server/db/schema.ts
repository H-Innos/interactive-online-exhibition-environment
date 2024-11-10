import { sql } from "drizzle-orm";
import {
  pgTableCreator,
  serial,
  timestamp,
  varchar,
  text,
  uniqueIndex,
  boolean,
  integer,
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

export const quizzes = createTable(
  "quiz",
  {
    id: serial("id").primaryKey(),
    title: varchar("name", { length: 256 }).notNull(),
    exhibitionId: integer("exhibition_id")
      .notNull()
      .references(() => exhibitions.id),
  },
);

export const questions = createTable(
  "question",
  {
    id: serial("id").primaryKey(),
    quizId: integer("quiz_id")
      .notNull()
      .references(() => quizzes.id),
    text: varchar("text", { length: 256 }).notNull(),
    imageUrl: varchar("image", { length: 512 }).default(""),
  },
);

export const answers = createTable(
  "answer",
  {
    id: serial("id").primaryKey(),
    questionId: integer("question_id")
      .notNull()
      .references(() => questions.id),
    text: varchar("text", { length: 256 }).notNull(),
    isCorrect: boolean("is_correct").notNull().default(false),
  },
);

