import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  exhibitions,
  exhibitionCategories,
  categories,
  type ExhibitionDBSchema,
} from "~/server/db/schema";
import { eq } from "drizzle-orm";
import type {
  Exhibition,
  Category,
  ExhibitionStatus,
  Contributor,
} from "~/lib/types/entities";
import { type DrizzleClient } from "~/server/db";
import { PgColumn } from "drizzle-orm/pg-core";

export const exhibitionRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Exhibition name is required."),
        description: z.string().optional(),
        thumbnailUrl: z.string().optional(),
        exhibitionCoverUrl: z.string().optional(),
        categories: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }): Promise<Exhibition> => {
      const newExhibition = await ctx.db
        .insert(exhibitions)
        .values({
          name: input.name,
          description: input.description ?? "",
          thumbnailUrl: input.thumbnailUrl ?? "",
          exhibitionCoverUrl: input.exhibitionCoverUrl ?? "",
          status: "draft",
        })
        .returning();
      const createdExhibition = newExhibition[0];
      if (!createdExhibition) {
        throw new Error("Failed to create exhibition");
      }

      let associatedCategories: Category[] = [];

      if (input.categories && input.categories.length > 0) {
        const existingCategories = await ctx.db.query.categories.findMany({
          where: (categories, { inArray }) =>
            inArray(categories.name, input.categories ?? []),
        });

        const existingCategoryNames = existingCategories.map((c) => c.name);
        const newCategoryNames = input.categories.filter(
          (c) => !existingCategoryNames.includes(c),
        );

        if (newCategoryNames.length > 0) {
          await ctx.db
            .insert(categories)
            .values(newCategoryNames.map((name) => ({ name })));
        }

        const allCategories = await ctx.db.query.categories.findMany({
          where: (categories, { inArray }) =>
            inArray(categories.name, input.categories ?? []),
        });

        await ctx.db.insert(exhibitionCategories).values(
          allCategories.map((category) => ({
            exhibitionId: createdExhibition.id,
            categoryId: category.id,
          })),
        );
        associatedCategories = allCategories;
      }

      const fullExhibition: Exhibition = {
        ...createdExhibition,
        categories: associatedCategories,
        status: assertExhibitionStatus(createdExhibition.status),
        contributors: [],
      };

      return fullExhibition;
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
        categories: z.array(z.string()).optional(),
        contributors: z
          .array(z.object({ role: z.string(), names: z.string() }))
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
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
            contributors: JSON.stringify(input.contributors),
          })
          .where(eq(exhibitions.id, input.id));

        if (input.categories && input.categories.length > 0) {
          await ctx.db
            .delete(exhibitionCategories)
            .where(eq(exhibitionCategories.exhibitionId, input.id));

          const existingCategories = await ctx.db.query.categories.findMany({
            where: (categories, { inArray }) =>
              input.categories
                ? inArray(categories.name, input.categories)
                : undefined,
          });

          const existingCategoryNames = existingCategories.map((c) => c.name);
          const newCategoryNames = input.categories.filter(
            (c) => !existingCategoryNames.includes(c),
          );

          if (newCategoryNames.length > 0) {
            await ctx.db
              .insert(categories)
              .values(newCategoryNames.map((name) => ({ name })))
              .onConflictDoNothing();
          }

          const allCategories = await ctx.db.query.categories.findMany({
            where: (categories, { inArray }) =>
              input.categories
                ? inArray(categories.name, input.categories)
                : undefined,
          });

          await ctx.db.insert(exhibitionCategories).values(
            allCategories.map((category) => ({
              exhibitionId: input.id,
              categoryId: category.id,
            })),
          );
        } else {
          await ctx.db
            .delete(exhibitionCategories)
            .where(eq(exhibitionCategories.exhibitionId, input.id));
        }
        return { id: input.id };
      } catch (error) {
        console.error("Error updating exhibition:", error);
        throw new Error("Failed to update exhibition");
      }
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

  trash: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const exhibition = await ctx.db.query.exhibitions.findFirst({
        where: (exhibitions, { eq }) => eq(exhibitions.id, input.id),
      });

      if (!exhibition) {
        throw new Error("Exhibition not found");
      }

      if (exhibition.status === "trashed") {
        throw new Error("Exhibition is already trashed");
      }

      const trashedExhibition = await ctx.db
        .update(exhibitions)
        .set({ status: "trashed" })
        .where(eq(exhibitions.id, input.id))
        .returning();

      if (!trashedExhibition || trashedExhibition.length === 0) {
        throw new Error("Failed to trash exhibition");
      }

      return trashedExhibition[0];
    }),

  restore: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const exhibition = await ctx.db.query.exhibitions.findFirst({
        where: (exhibitions, { eq }) => eq(exhibitions.id, input.id),
      });

      if (!exhibition) {
        throw new Error("Exhibition not found");
      }

      if (exhibition.status !== "trashed") {
        throw new Error("Only trashed exhibitions can be restored");
      }

      const restoredExhibition = await ctx.db
        .update(exhibitions)
        .set({ status: "draft" })
        .where(eq(exhibitions.id, input.id))
        .returning();

      if (!restoredExhibition || restoredExhibition.length === 0) {
        throw new Error("Failed to restore exhibition");
      }

      return restoredExhibition[0];
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

  featureExhibition: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const exhibition = await ctx.db.query.exhibitions.findFirst({
        where: (exhibitions, { eq }) => eq(exhibitions.id, input.id),
      });

      if (!exhibition) {
        throw new Error("Exhibition not found");
      }

      const featuredExhibition = await ctx.db
        .update(exhibitions)
        .set({ isFeatured: true })
        .where(eq(exhibitions.id, input.id))
        .returning();

      return featuredExhibition[0];
    }),

  unfeatureExhibition: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const exhibitionToUnfeature = await ctx.db.query.exhibitions.findFirst({
        where: (exhibitions, { eq }) => eq(exhibitions.id, input.id),
      });

      if (!exhibitionToUnfeature) {
        throw new Error("Exhibition not found");
      }

      const unfeaturedExhibition = await ctx.db
        .update(exhibitions)
        .set({ isFeatured: false })
        .where(eq(exhibitions.id, input.id))
        .returning();

      return unfeaturedExhibition[0];
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const allExhibitions = await getExhibitions(ctx.db);

    return allExhibitions.map((exhibition) => mapExhibition(exhibition));
  }),

  getOne: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const exhibition = await getExhibition(ctx.db, input.id);
      return mapExhibition(exhibition);
    }),

  getDrafts: publicProcedure.query(async ({ ctx }) => {
    const exhibitions = await getExhibitions(ctx.db, "status", "draft");
    return exhibitions.map((exhibition) => mapExhibition(exhibition));
  }),

  getPublished: publicProcedure.query(async ({ ctx }) => {
    const exhibitions = await getExhibitions(ctx.db, "status", "published");

    return exhibitions.map((exhibition) => mapExhibition(exhibition));
  }),

  getArchived: publicProcedure.query(async ({ ctx }) => {
    const exhibitions = await getExhibitions(ctx.db, "status", "archived");

    return exhibitions.map((exhibition) => mapExhibition(exhibition));
  }),

  getTrashed: publicProcedure.query(async ({ ctx }) => {
    const exhibitions = await getExhibitions(ctx.db, "status", "trashed");
    return exhibitions.map((exhibition) => mapExhibition(exhibition));
  }),

  getFeatured: publicProcedure.query(async ({ ctx }) => {
    const exhibitions = await getExhibitions(ctx.db, "isFeatured", true);
    return exhibitions.map((exhibition) => mapExhibition(exhibition));
  }),
});

async function getExhibitions<K extends keyof ExhibitionDBSchema>(
  db: DrizzleClient,
  column?: K,
  value?: ExhibitionDBSchema[K],
): Promise<ExhibitionFromDB[]> {
  const fullExhibitions = await db.query.exhibitions.findMany({
    where:
      column && value
        ? (
            exhibitions: {
              [key in keyof ExhibitionDBSchema]: PgColumn;
            },
            { eq },
          ) => eq(exhibitions[column], value)
        : undefined,
    orderBy: (exhibitions, { desc }) => [desc(exhibitions.createdAt)],
    with: {
      quizzes: {
        with: {
          questions: {
            with: {
              answers: true,
            },
          },
        },
      },
      exhibitionCategories: {
        with: {
          category: true,
        },
      },
    },
  });

  return fullExhibitions;
}

async function getExhibition(db: DrizzleClient, id: number) {
  const exhibition = await db.query.exhibitions.findFirst({
    where: (exhibitions, { eq }) => eq(exhibitions.id, id),
    with: {
      quizzes: {
        with: {
          questions: {
            with: {
              answers: true,
            },
          },
        },
      },
      exhibitionCategories: {
        with: {
          category: true,
        },
      },
    },
  });
  if (!exhibition) throw new Error("Exhibition not found");
  return exhibition;
}

type ExhibitionFromDB = Awaited<ReturnType<typeof getExhibition>>;

function mapExhibition(exhibition: ExhibitionFromDB): Exhibition {
  return {
    ...exhibition,
    status: assertExhibitionStatus(exhibition.status),
    categories: exhibition.exhibitionCategories.map((ec) => ec.category),
    contributors: assertContributors(exhibition.contributors),
  };
}

// TEMPORARY to ensure type safety, "status" in db is currently stored as a string not an enum
//type ExhibitionStatus = "draft" | "published" | "archived" | "trashed";
function assertExhibitionStatus(status: string): ExhibitionStatus {
  if (
    status === "draft" ||
    status === "published" ||
    status === "archived" ||
    status === "trashed"
  ) {
    return status;
  }
  throw new Error(`Invalid exhibition status: ${status}`);
}

function assertContributors(contributorsJson: string | null): Contributor[] {
  if (contributorsJson === null || contributorsJson === undefined) {
    return [];
  }

  if (contributorsJson.trim() === "") {
    return [];
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const parsedData: Contributor[] = JSON.parse(contributorsJson);
    return parsedData;
  } catch (error) {
    console.error("Error parsing contributors JSON:", error);
    return [];
  }
}
