import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { categories } from "~/server/db/schema";
import { z } from "zod";

export const categoryRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.categories.findMany();
  }),
  create: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const newCategory = await ctx.db
        .insert(categories)
        .values({
          name: input.name,
        })
        .returning();
      return newCategory[0];
    }),
});
