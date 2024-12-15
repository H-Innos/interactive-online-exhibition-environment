import React from "react";
import { Document, Page, Text, Image, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 12 },
  heading: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  subheading: { fontSize: 14, marginBottom: 5, textAlign: "center" },
  paragraph: { marginBottom: 10 },
  image: { width: 300, height: "auto", marginBottom: 10, alignSelf: "center" },
  metadata: { marginBottom: 20, textAlign: "center", fontSize: 10 },
});

type ContentElement = JSX.Element | null;

interface Exhibition {
  name: string;
  description: string;
  updatedAt: string;
  content: string;
}

export const generatePDFContent = (exhibition: Exhibition): JSX.Element => {
  const { name, description, updatedAt, content } = exhibition;

  // Fallback values for invalid or missing fields
  const safeName = name || "Untitled Exhibition";
  const safeDescription = description || "No description available.";
  const safeUpdatedAt = updatedAt
    ? new Date(updatedAt).toLocaleDateString()
    : "Date not available";

  const parser = new DOMParser();
  const parsedDocument = parser.parseFromString(
    content || "<p>No content available.</p>",
    "text/html",
  );

  const renderContent = (
    node: HTMLElement,
  ): ContentElement | ContentElement[] => {
    switch (node.tagName) {
      case "P": // Paragraphs
        return (
          <Text key={Math.random()} style={styles.paragraph}>
            {node.textContent}
          </Text>
        );
      case "IMG": // Images in exhibition content
        const src = node.getAttribute("src");
        if (src) {
          return <Image key={Math.random()} style={styles.image} src={src} />;
        }
        return null;
      case "DIV": // Handle nested divs
        return Array.from(node.children)
          .map((childNode) => renderContent(childNode as HTMLElement))
          .flat();
      default:
        return null; // Ignore unsupported tags
    }
  };

  const parsedContent = Array.from(parsedDocument.body.children)
    .flatMap((node) => renderContent(node as HTMLElement))
    .filter((element): element is JSX.Element => element !== null);

  return (
    <Document>
      <Page style={styles.page}>
        {/* Title */}
        <Text style={styles.heading}>{safeName}</Text>

        {/* Description */}
        <Text style={styles.subheading}>{safeDescription}</Text>

        {/* Creation Date */}
        <Text style={styles.metadata}>Updated at: {safeUpdatedAt}</Text>

        {/* Content */}
        {parsedContent}
      </Page>
    </Document>
  );
};
