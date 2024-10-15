import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { exhibitions } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const exhibitionRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        coverImageUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log("Received values in create mutation:", input);

      await ctx.db.insert(exhibitions).values({
        name: input.name,
        description: input.description ?? "",
        coverImageUrl: input.coverImageUrl ?? "",
      });
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const allExhibitions = await ctx.db.query.exhibitions.findMany({
      orderBy: (exhibitions, { desc }) => [desc(exhibitions.createdAt)],
    });
    return allExhibitions ?? []; 
  }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    const exhibition = await ctx.db.query.exhibitions.findFirst({
      orderBy: (exhibitions, { desc }) => [desc(exhibitions.createdAt)],
    });
    return exhibition ?? null;
  }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const deletedExhibition = await ctx.db.delete(exhibitions)
        .where(eq(exhibitions.id, input.id))
        .returning();

      if (deletedExhibition.length === 0) {
        throw new Error("Exhibition not found");
      }

      return deletedExhibition[0];
    }),
});
