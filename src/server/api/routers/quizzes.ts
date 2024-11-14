import { createTRPCRouter, publicProcedure } from "../trpc";
import { answers, questions, quizzes } from "~/server/db/schema";
import { z } from "zod";
import { createQuizSchema } from "~/lib/types/schemas";
import { eq } from "drizzle-orm";

export const quizRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      createQuizSchema
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        const existingExhibition = await tx.query.exhibitions.findFirst({
          where: (exhibitions, { eq }) => eq(exhibitions.id, input.exhibitionId),
        });
  
        if (!existingExhibition) {
          tx.rollback();
          throw new Error(`No exhibition found with ID ${input.exhibitionId}`);
        }
  
        const newQuiz = await tx.insert(quizzes).values({
            title: input.title,
            exhibitionId: input.exhibitionId,
        }).returning();
  
        if (!newQuiz[0]) {
          tx.rollback();
          throw new Error("Failed to create quiz.");
        }
        const quizId = newQuiz[0].id;
  
        for (const question of input.questions) {
          const newQuestion = await tx.insert(questions).values({
            quizId: quizId,
            text: question.text,
            imageUrl: question.imageUrl,
          }).returning();
          
          if (!newQuestion[0]) {
            tx.rollback();
            throw new Error("Failed to create question.");
          }
          
          const questionId = newQuestion[0].id;
  
          for (const answer of question.answers) {
            const newAnswer = await tx.insert(answers).values({
              questionId: questionId,
              text: answer.text,
              isCorrect: answer.isCorrect,
            }).returning();
  
            if (!newAnswer[0]) {
              tx.rollback();
              throw new Error("Failed to create answer.");
            }
          }
        }
        return newQuiz;
      });
    }),
  
  delete: publicProcedure
    .input(z.object({ quizId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.delete(quizzes)
        .where(eq(quizzes.id, input.quizId))
        .returning();
    }),
    
  getAllByExhibitionId: publicProcedure
    .input(z.object({exhibitionId: z.number()}))
    .query(async ({ ctx, input }) => {
       return await ctx.db.query.quizzes.findMany({
        where: (quizzes, { eq }) => eq(quizzes.exhibitionId, input.exhibitionId),
        with: {
          questions: {
            with: {
              answers: true,
            }
          }
        }
       })
    }),

  getOne: publicProcedure
    .input(z.object({quizId: z.number()}))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.quizzes.findFirst({
        where: (quizzes, { eq }) => eq(quizzes.id, input.quizId),
        with: {
          questions: {
            with: {
              answers: true,
            }
          },
        }
    })
  }),
});