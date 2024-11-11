import { createTRPCRouter, publicProcedure } from "../trpc";
import { answers, questions, quizzes } from "~/server/db/schema";
import { quizSchema } from "~/lib/types/schemas";
import { z } from "zod";

export const quizRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      quizSchema
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
});