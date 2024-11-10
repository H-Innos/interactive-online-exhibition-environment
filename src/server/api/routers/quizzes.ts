import { createTRPCRouter, publicProcedure } from "../trpc";
import { answers, questions, quizzes } from "~/server/db/schema";
import { quizSchema } from "~/lib/types/schemas";

export const quizRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      quizSchema
    )
    .mutation(async ({ ctx, input }) => {
      const existingExhibition = await ctx.db.query.exhibitions.findFirst({
        where: (exhibitions, { eq }) => eq(exhibitions.id, input.exhibitionId),
      });

      if (!existingExhibition) {
        throw new Error(`No exhibition found with ID ${input.exhibitionId}`);
      }

      const newQuiz = await ctx.db.insert(quizzes).values({
          title: input.title,
          exhibitionId: input.exhibitionId,
      }).returning();

      if (!newQuiz[0]) {
          throw new Error("Failed to create quiz.");
      }
      const quizId = newQuiz[0].id;

      for (const question of input.questions) {
        const newQuestion = await ctx.db.insert(questions).values({
          quizId: quizId,
          text: question.text,
          imageUrl: question.imageUrl,
        }).returning();
        
        if (!newQuestion[0]) {
          throw new Error("Failed to create question.");
        }
        
        const questionId = newQuestion[0].id;

        for (const answer of question.answers) {
          const newAnswer = await ctx.db.insert(answers).values({
            questionId: questionId,
            text: answer.text,
            isCorrect: answer.isCorrect,
          }).returning();

          if (!newAnswer[0]) {
            throw new Error("Failed to create answer.");
          }
        }
      }
      return newQuiz;
    }),
});




