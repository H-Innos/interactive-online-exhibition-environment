import { relations, sql } from "drizzle-orm";
import {
  pgTableCreator,
  serial,
  timestamp,
  varchar,
  text,
  boolean,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator(
  (name) => `interactive-online-exhibition-environment_${name}`,
);

export const answers = createTable("answer", {
  id: serial("id").primaryKey(),
  questionId: serial("question_id")
    .notNull()
    .references(() => questions.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  text: varchar("text", { length: 256 }).notNull(),
  isCorrect: boolean("is_correct").notNull().default(false),
});

export const questions = createTable("question", {
  id: serial("id").primaryKey(),
  quizId: serial("quiz_id")
    .notNull()
    .references(() => quizzes.id, { onDelete: "cascade", onUpdate: "cascade" }),
  text: varchar("text", { length: 256 }).notNull(),
  imageUrl: varchar("image", { length: 512 }).default(""),
});

export const quizzes = createTable("quiz", {
  id: serial("id").primaryKey(),
  title: varchar("name", { length: 256 }).notNull(),
  exhibitionId: serial("exhibition_id")
    .notNull()
    .references(() => exhibitions.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
});

const exhibitionStatus = pgEnum("status", ["draft", "published", "archived"]);

export const exhibitions = createTable("post", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  description: text("description").default(""),
  thumbnailUrl: varchar("cover_image_url", { length: 512 }).default(""),
  exhibitionCoverUrl: varchar("exhibition_cover_url", { length: 512 }).default(
    "",
  ),
  coverImagePositionX: integer("cover_image_position_x").default(50).notNull(),
  coverImagePositionY: integer("cover_image_position_y").default(50).notNull(),
  isPublished: boolean("is_published").default(false).notNull(), // DO NOT USE THIS FIELD, USE "status" INSTEAD, (remove when database is fixed)
  isArchived: boolean("is_archived").default(false).notNull(), // DO NOT USE THIS FIELD, USE "status" INSTEAD, (remove when database is fixed)
  content: text("content").default(""),
  status: varchar("status", { length: 20 }).default("draft").notNull(),
  backgroundColor: varchar("background_color", { length: 7 }).default(
    "#FFFFFF",
  ),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export const exhibitionsRelations = relations(exhibitions, ({ many }) => ({
  quizzes: many(quizzes),
}));

export const quizzesRelations = relations(quizzes, ({ one, many }) => ({
  exhibitions: one(exhibitions, {
    fields: [quizzes.exhibitionId],
    references: [exhibitions.id],
  }),
  questions: many(questions),
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
  quizzes: one(quizzes, {
    fields: [questions.quizId],
    references: [quizzes.id],
  }),
  answers: many(answers),
}));

export const answersRelations = relations(answers, ({ one }) => ({
  questions: one(questions, {
    fields: [answers.questionId],
    references: [questions.id],
  }),
}));

export const users = createTable("user", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 256 }).notNull().unique(),
  password: varchar("password", { length: 256 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
