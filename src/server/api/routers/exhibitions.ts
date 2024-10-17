import { z } from "zod";
import { sql } from "drizzle-orm";
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
        description: input.description ?? "",
        coverImageUrl: input.coverImageUrl ?? "",
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1),
        description: z.string().optional(),
        coverImageUrl: z.string().optional(),
        content: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.update(posts).set({
        name: input.name,
        description: input.description,
        coverImageUrl: input.coverImageUrl,
        content: input.content || "" 
      }).where(sql`id = ${input.id}`); // TODO validate, unsafe
      // }).where((posts, { eq }) => eq(posts.id, input.id)); // !???!
    }),
   

  getAll: publicProcedure.query(async ({ ctx }) => {
    const allPosts = await ctx.db.query.posts.findMany({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });
    return allPosts ?? []; 
  }),

  getOne: publicProcedure
    .input(z.object({ id: z.string() })) 
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.query.posts.findFirst({
        where: (posts, { eq }) => eq(posts.id, input.id), 
      });
      return post ?? null; 
    }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.query.posts.findFirst({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });
    return post ?? null;
  }),
});
