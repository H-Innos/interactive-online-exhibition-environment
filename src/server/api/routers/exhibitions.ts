import { z } from "zod";
import { createTRPCRouter, publicProcedure, type createTRPCContext } from "~/server/api/trpc";
import { exhibitions } from "~/server/db/schema";
import { and, desc, eq, inArray, ne } from "drizzle-orm";
import { configurations } from "~/lib/constants/config";

import type { ExhibitionStatus } from "~/lib/types/entities";

async function changeStatus(
  db: Awaited<ReturnType<typeof createTRPCContext>>["db"],
  id: number,
  allowed: ExhibitionStatus[],
  status: ExhibitionStatus,
) {
  const [exhibition] = await db
    .update(exhibitions)
    .set({ status })
    .where(and(eq(exhibitions.id, id), inArray(exhibitions.status, allowed)))
    .returning();

  if (!exhibition) {
    throw new Error(`No exhibition in an eligible state for transition to "${status}"`);
  }

  return exhibition;
}

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
      const newExhibition = await ctx.db.insert(exhibitions).values({
        name: input.name,
        status: "draft",
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
      await ctx.db
        .update(exhibitions)
        .set({
          name: input.name,
          description: input.description,
          coverImageUrl: input.coverImageUrl,
          content: input.content,
        })
        .where(and(eq(exhibitions.id, input.id), ne(exhibitions.status, "trashed")));
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const allExhibitions = await ctx.db.query.exhibitions.findMany({
      where: ne(exhibitions.status, "trashed"),
      orderBy: (exhibitions, { desc }) => [desc(exhibitions.createdAt)],
    });
    return allExhibitions ?? [];
  }),

  getOne: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const exhibition = await ctx.db.query.exhibitions.findFirst({
        where: and(eq(exhibitions.id, input.id), ne(exhibitions.status, "trashed")),
      });
      return exhibition ?? null;
    }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    const exhibition = await ctx.db.query.exhibitions.findFirst({
      where: ne(exhibitions.status, "trashed"),
      orderBy: (exhibitions, { desc }) => [desc(exhibitions.createdAt)],
    });
    return exhibition ?? null;
  }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const deletedExhibition = await ctx.db
        .delete(exhibitions)
        .where(and(eq(exhibitions.id, input.id), eq(exhibitions.status, "draft")))
        .returning();

      if (deletedExhibition.length === 0) {
        throw new Error("Exhibition not found");
      }

      return deletedExhibition[0];
    }),

  getDrafts: publicProcedure.query(({ ctx }) =>
    ctx.db.query.exhibitions.findMany({
      where: eq(exhibitions.status, "draft"),
      orderBy: desc(exhibitions.createdAt),
    })
  ),

  publish: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input }) =>
      changeStatus(ctx.db, input.id, ["draft", "published"], "published")
    ),

  unpublish: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input }) =>
      changeStatus(ctx.db, input.id, ["published", "draft"], "draft")
    ),

  getArchived: publicProcedure.query(({ ctx }) =>
    ctx.db.query.exhibitions.findMany({ where: eq(exhibitions.status, "archived") })
  ),

  archiveExhibition: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input }) =>
      changeStatus(ctx.db, input.id, ["draft", "archived"], "archived")
    ),

  unarchiveExhibition: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input }) =>
      changeStatus(ctx.db, input.id, ["archived", "draft"], "draft")
    ),
});
