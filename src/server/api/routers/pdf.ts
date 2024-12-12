import { generateExhibitionPDF } from "~/lib/utils/pdfGenerator";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { eq } from "drizzle-orm";
import { exhibitions } from "~/server/db/schema";

export const pdfRouter = createTRPCRouter({
  generateExhibitionPDF: publicProcedure
    .input(z.object({ exhibitionId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const exhibition = await ctx.db.query.exhibitions.findFirst({
          where: eq(exhibitions.id, input.exhibitionId),
        });

        if (!exhibition) {
          throw new Error("Exhibition not found");
        }

        const pdfBuffer = await generateExhibitionPDF(exhibition);
        const fileName = `${exhibition.name.replace(/\s+/g, "_")}_exhibition.pdf`;

        return {
          pdfBuffer: pdfBuffer.toString("base64"),
          fileName,
        };
      } catch (error) {
        console.error("Error generating PDF:", error);
        throw new Error("Failed to generate PDF");
      }
    }),
});
