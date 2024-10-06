import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { posts } from "~/server/db/schema";

export const postRouter = createTRPCRouter({
  // Mutation to create a new post with description and coverImageUrl fields
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1), // Name is required
        description: z.string().optional(), // Description is optional
        coverImageUrl: z.string().optional(), // Cover image URL is optional
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(posts).values({
        name: input.name,
        description: input.description || "", // Default to empty string if not provided
        coverImageUrl: input.coverImageUrl || "", // Default to empty string if not provided
      });
    }),

  // Query to get all posts
  getAll: publicProcedure.query(async ({ ctx }) => {
    const allPosts = await ctx.db.query.posts.findMany({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });
    return allPosts ?? [];
  }),

  // Query to get the latest post
  getLatest: publicProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.query.posts.findFirst({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });
    return post ?? null;
  }),
});
