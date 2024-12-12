import PDFDocument from "pdfkit";
import { type InferSelectModel } from "drizzle-orm";
import { exhibitions } from "~/server/db/schema";

type Exhibition = InferSelectModel<typeof exhibitions>;

export const generateExhibitionPDF = async (
  exhibition: Exhibition,
): Promise<Buffer> => {
  const doc = new PDFDocument({ font: "Courier" }); // Use Courier font, which is built-in
  const buffers: Uint8Array[] = [];

  doc.on("data", (chunk) => buffers.push(chunk));
  doc.on("end", () => {});

  // Set up the PDF content
  doc
    .fontSize(16)
    .text(`Exhibition: ${exhibition.name}`, { underline: true })
    .moveDown()
    .fontSize(12)
    .text(
      `Description: ${exhibition.description || "No description available."}`,
    )
    .moveDown();

  // Format dates
  const startDate = exhibition.updatedAt
    ? new Date(exhibition.updatedAt).toLocaleDateString()
    : "N/A";
  const endDate = exhibition.createdAt
    ? new Date(exhibition.createdAt).toLocaleDateString()
    : "N/A";

  doc.text(`Start Date: ${startDate}`);
  doc.text(`End Date: ${endDate}`);

  // Add more content as needed

  doc.end();

  return Buffer.concat(buffers);
};

export default generateExhibitionPDF;
