import { relations, sql } from "drizzle-orm";
import {
  pgTableCreator,
  serial,
  timestamp,
  varchar,
  text,
  uniqueIndex,
  boolean,
} from "drizzle-orm/pg-core";

import { exhibitionStatuses } from "~/lib/types/entities";

export const createTable = pgTableCreator(
  (name) => `interactive-online-exhibition-environment_${name}`
);

export const answers = createTable(
  "answer",
  {
    id: serial("id").primaryKey(),
    questionId: serial("question_id")
      .notNull()
      .references(() => questions.id, {onDelete: 'cascade', onUpdate: 'cascade'}),
    text: varchar("text", { length: 256 }).notNull(),
    isCorrect: boolean("is_correct").notNull().default(false),
  },
);

export const questions = createTable(
  "question",
  {
    id: serial("id").primaryKey(),
    quizId: serial("quiz_id")
      .notNull()
      .references(() => quizzes.id, {onDelete: 'cascade', onUpdate: 'cascade'}),
    text: varchar("text", { length: 256 }).notNull(),
    imageUrl: varchar("image", { length: 512 }).default(""),
  },
);

export const quizzes = createTable(
  "quiz",
  {
    id: serial("id").primaryKey(),
    title: varchar("name", { length: 256 }).notNull(),
    exhibitionId: serial("exhibition_id")
      .notNull()
      .references(() => exhibitions.id, {onDelete: 'cascade', onUpdate: 'cascade'}),
  },
);

export const exhibitions = createTable(
  "post",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    description: text("description").default(""),
    coverImageUrl: varchar("cover_image_url", { length: 512 }).default(""),
    content: text("content").default(""),
    status: varchar("status", { enum: exhibitionStatuses }).default("draft").notNull(),
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