import { type Question, questionSchema } from "~/lib/types/schemas";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { questions } from "~/server/db/schema";
import { z } from "zod";
import { type DrizzleClient } from "~/server/db";
import { getAnswersByQuestionId } from "./answers";

export async function getQuestionsByQuizId(db: DrizzleClient, input: { quizId: number }) {
  const questionsWithAnswers: Question[] = [];
  
  db.query.questions.findMany({
    where: (questions, { eq }) => eq(questions.quizId, input.quizId),
  })
  .then(questions => {
    questions.forEach(question => {
      getAnswersByQuestionId(db, { questionId: question.id })
      .then(answers => {
        questions.forEach(question => {
          questionsWithAnswers.push({ ...question, answers });
        });
      })
      .catch(error => {
        throw new Error("Error fetching answers: " + error);
      });
  })})
  .catch(error => {
    throw new Error("Error fetching questions: " + error);
  });

  return questionsWithAnswers;
}

export const questionRouter = createTRPCRouter({
  create: publicProcedure
    .input(questionSchema)
    .mutation(async ({ ctx, input }) => {
      const newQuestion = await ctx.db.insert(questions).values({
          quizId: input.quizId,
          text: input.text,
          imageUrl: input.imageUrl,
    }).returning();

    return newQuestion;
  }),
  createAll: publicProcedure
    .input(z.array(questionSchema))
    .mutation(async ({ ctx, input }) => {
      const newQuestions = await ctx.db.insert(questions).values(input.map(question => ({
        quizId: question.quizId,
        text: question.text,
        imageUrl: question.imageUrl,
      }))).returning();

      return newQuestions;
    }),
});