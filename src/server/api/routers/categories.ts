import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { categories } from "~/server/db/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";

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

  delete: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const deletedCategory = await ctx.db
        .delete(categories)
        .where(eq(categories.name, input.name))
        .returning();

      if (deletedCategory.length === 0) {
        throw new Error(`Category with name "${input.name}" not found`);
      }

      return deletedCategory[0];
    }),
});
