import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { exhibitions } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const exhibitionRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Exhibition name is required."),
        description: z.string().optional(),
        thumbnailUrl: z.string().optional(),
        exhibitionCoverUrl: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const newExhibition = await ctx.db.insert(exhibitions).values({
        name: input.name,
        description: input.description ?? "",
        thumbnailUrl: input.thumbnailUrl ?? "",
        exhibitionCoverUrl: input.exhibitionCoverUrl ?? "",
      });

      return newExhibition;
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1, { message: "Exhibition name is required." }),
        description: z.string().optional(),
        thumbnailUrl: z.string().optional(),
        exhibitionCoverUrl: z.string().optional(),
        coverImagePositionX: z.number().optional(),
        coverImagePositionY: z.number().optional(),
        content: z.string().optional(),
        backgroundColor: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(exhibitions)
        .set({
          name: input.name,
          description: input.description,
          thumbnailUrl: input.thumbnailUrl,
          exhibitionCoverUrl: input.exhibitionCoverUrl,
          coverImagePositionX: input.coverImagePositionX,
          coverImagePositionY: input.coverImagePositionY,
          content: input.content,
          backgroundColor: input.backgroundColor,
        })
        .where(eq(exhibitions.id, input.id));
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
      const exhibitionToPublish = await ctx.db.query.exhibitions.findFirst({
        where: (exhibitions, { eq }) => eq(exhibitions.id, input.id),
      });

      if (!exhibitionToPublish) {
        throw new Error("Exhibition not found");
      }

      const publishedExhibition = await ctx.db
        .update(exhibitions)
        .set({
          status: "published",
        })
        .where(eq(exhibitions.id, input.id))
        .returning();

      return publishedExhibition[0];
    }),

  unpublish: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const exhibitionToUnpublish = await ctx.db.query.exhibitions.findFirst({
        where: (exhibitions, { eq }) => eq(exhibitions.id, input.id),
      });

      if (!exhibitionToUnpublish) {
        throw new Error("Exhibition not found");
      }

      const unpublishedExhibition = await ctx.db
        .update(exhibitions)
        .set({
          status: "draft",
        })
        .where(eq(exhibitions.id, input.id))
        .returning();

      return unpublishedExhibition;
    }),

  archiveExhibition: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const exhibition = await ctx.db.query.exhibitions.findFirst({
        where: (exhibitions, { eq }) => eq(exhibitions.id, input.id),
      });

      if (!exhibition) {
        throw new Error("Exhibition not found");
      }

      if (exhibition.status === "published") {
        throw new Error("Cannot archive a published exhibition");
      }

      const archivedExhibition = await ctx.db
        .update(exhibitions)
        .set({ status: "archived" })
        .where(eq(exhibitions.id, input.id))
        .returning();

      return archivedExhibition[0];
    }),

  unarchiveExhibition: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const exhibitionToUnarchive = await ctx.db.query.exhibitions.findFirst({
        where: (exhibitions, { eq }) => eq(exhibitions.id, input.id),
      });

      if (!exhibitionToUnarchive) {
        throw new Error("Exhibition not found");
      }

      if (exhibitionToUnarchive.status !== "archived") {
        throw new Error("Exhibition is not archived");
      }

      const unarchivedExhibition = await ctx.db
        .update(exhibitions)
        .set({ status: "draft" })
        .where(eq(exhibitions.id, input.id))
        .returning();

      return unarchivedExhibition[0];
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const allExhibitions = await ctx.db.query.exhibitions.findMany({
      orderBy: (exhibitions, { desc }) => [desc(exhibitions.createdAt)],
    });

    // TEMPORARY to ensure type safety, "status" in db is currently stored as a string not an enum
    return (allExhibitions ?? []).map((exhibition) => ({
      ...exhibition,
      status: assertExhibitionStatus(exhibition.status),
    }));
  }),

  getOne: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const exhibition = await ctx.db.query.exhibitions.findFirst({
        where: (exhibitions, { eq }) => eq(exhibitions.id, input.id),
      });

      // TEMPORARY to ensure type safety, "status" in db is currently stored as a string not an enum
      return exhibition
        ? { ...exhibition, status: assertExhibitionStatus(exhibition.status) }
        : null;
    }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    const exhibition = await ctx.db.query.exhibitions.findFirst({
      orderBy: (exhibitions, { desc }) => [desc(exhibitions.createdAt)],
    });

    // TEMPORARY to ensure type safety, "status" in db is currently stored as a string not an enum
    return exhibition
      ? { ...exhibition, status: assertExhibitionStatus(exhibition.status) }
      : null;
  }),

  getDrafts: publicProcedure.query(async ({ ctx }) => {
    const exhibitions = await ctx.db.query.exhibitions.findMany({
      where: (exhibitions, { eq }) => eq(exhibitions.status, "draft"),
    });

    // TEMPORARY to ensure type safety, "status" in db is currently stored as a string not an enum
    return exhibitions.map((exhibition) => ({
      ...exhibition,
      status: assertExhibitionStatus(exhibition.status),
    }));
  }),

  getPublished: publicProcedure.query(async ({ ctx }) => {
    const exhibitions = await ctx.db.query.exhibitions.findMany({
      where: (exhibitions, { eq }) => eq(exhibitions.status, "published"),
    });

    // TEMPORARY to ensure type safety, "status" in db is currently stored as a string not an enum
    return exhibitions.map((exhibition) => ({
      ...exhibition,
      status: assertExhibitionStatus(exhibition.status),
    }));
  }),

  getArchived: publicProcedure.query(async ({ ctx }) => {
    const exhibitions = await ctx.db.query.exhibitions.findMany({
      where: (exhibitions, { eq }) => eq(exhibitions.status, "archived"),
    });

    // TEMPORARY to ensure type safety, "status" in db is currently stored as a string not an enum
    return exhibitions.map((exhibition) => ({
      ...exhibition,
      status: assertExhibitionStatus(exhibition.status),
    }));
  }),
});

// TEMPORARY to ensure type safety, "status" in db is currently stored as a string not an enum
type ExhibitionStatus = "draft" | "published" | "archived";

function assertExhibitionStatus(status: string): ExhibitionStatus {
  if (status === "draft" || status === "published" || status === "archived") {
    return status as ExhibitionStatus;
  }
  throw new Error("Invalid exhibition status");
}
