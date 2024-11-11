import { type DrizzleClient } from "~/server/db";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { answerSchema } from "~/lib/types/schemas";
import { z } from "zod";
import { answers } from "~/server/db/schema";

export async function getAnswersByQuestionId(db: DrizzleClient, input: { questionId: number }) {
  const answers = await db.query.answers.findMany({
    where: (answers, { eq }) => eq(answers.questionId, input.questionId),
  });
  
  return answers ?? [];
}

export const answerRouter = createTRPCRouter({
  create: publicProcedure
    .input(answerSchema)
    .mutation(async ({ ctx, input }) => {
      const newAnswer = await ctx.db.insert(answers).values({
        questionId: input.questionId,
        text: input.text,
        isCorrect: input.isCorrect,
      }).returning();

      return newAnswer;
    }),
  createAll: publicProcedure
    .input(z.array(answerSchema))
    .mutation(async ({ ctx, input }) => {
      const newAnswers = await ctx.db.insert(answers).values(input.map(answer => ({
        questionId: answer.questionId,
        text: answer.text,
        isCorrect: answer.isCorrect,
      }))).returning();

      return newAnswers;
    }),
});