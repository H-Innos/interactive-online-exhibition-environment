import { z } from "zod";
import { sql } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { exhibitions } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { configurations } from "~/constants/config";

export const exhibitionRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Exhibition name is required."),
        description: z.string().optional(),
        coverImageUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingExhibition = await ctx.db.query.exhibitions.findFirst({
        where: (exhibitions, { eq }) => eq(exhibitions.name, input.name),
      });

      if (existingExhibition) {
        throw new Error("An exhibition with this name already exists.");
      }

      const newExhibition = await ctx.db.insert(exhibitions).values({
        name: input.name,
        description: input.description ?? "",
        coverImageUrl: input.coverImageUrl ?? "",
      });

      return newExhibition;
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1, { message: "Exhibition name is required." }),
        description: z.string().max(configurations.MAX_DESCRIPTION_LENGTH).optional(),
        coverImageUrl: z.string().optional(),
        content: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingExhibition = await ctx.db.query.exhibitions.findFirst({
        where: (exhibitions, { eq, and }) =>
          and(eq(exhibitions.name, input.name), sql`id != ${input.id}`),
      });

      if (existingExhibition) {
        throw new Error("An exhibition with this name already exists.");
      }

      await ctx.db
        .update(exhibitions)
        .set({
          name: input.name,
          description: input.description,
          coverImageUrl: input.coverImageUrl,
          content: input.content,
        })
        .where(eq(exhibitions.id, input.id)); 
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const allExhibitions = await ctx.db.query.exhibitions.findMany({
      orderBy: (exhibitions, { desc }) => [desc(exhibitions.createdAt)],
    });
    return allExhibitions ?? [];
  }),

  getOne: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const exhibition = await ctx.db.query.exhibitions.findFirst({
        where: (exhibitions, { eq }) => eq(exhibitions.id, input.id),
      });
      return exhibition ?? null;
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
      const deletedExhibition = await ctx.db
        .delete(exhibitions)
        .where(eq(exhibitions.id, input.id))
        .returning();

      if (deletedExhibition.length === 0) {
        throw new Error("Exhibition not found");
      }

      return deletedExhibition[0];
    }),

  publish: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const publishedExhibition = await ctx.db.query.exhibitions.findFirst({
        where: (exhibitions, { eq }) => eq(exhibitions.id, input.id),
      });

      if (!publishedExhibition) {
        throw new Error("Exhibition not found");
      }

      publishedExhibition.isPublished = true;

      await ctx.db.update(exhibitions).set({
        isPublished: true,
      }).where(eq(exhibitions.id, input.id));

      return publishedExhibition;
    }),

    unpublish: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const unpublishedExhibition = await ctx.db.query.exhibitions.findFirst({
        where: (exhibitions, { eq }) => eq(exhibitions.id, input.id),
      });

      if (!unpublishedExhibition) {
        throw new Error("Exhibition not found");
      }

      await ctx.db.update(exhibitions).set({
        isPublished: false,
      }).where(eq(exhibitions.id, input.id));

      return { ...unpublishedExhibition, isPublished: false };
    }),

    checkTitleUnique: publicProcedure
    .input(z
      .object(
        { id: z.number(),
          name: z.string(),
        }))
    .query(async ({ ctx, input }) => {
      const existingExhibition = await ctx.db.query.exhibitions.findFirst({
        where: (exhibitions, { eq, and }) =>
          and(eq(exhibitions.name, input.name), sql`id != ${input.id}`),
      });

      return existingExhibition !== null;
    }),
});
