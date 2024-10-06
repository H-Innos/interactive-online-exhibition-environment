import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { posts } from "~/server/db/schema";

export const postRouter = createTRPCRouter({
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

    await ctx.db.insert(posts).values({
      name: input.name,
      description: input.description || "",
      coverImageUrl: input.coverImageUrl || "", 
    });
  }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const allPosts = await ctx.db.query.posts.findMany({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });
    return allPosts ?? [];
  }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.query.posts.findFirst({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });
    return post ?? null;
  }),
});
