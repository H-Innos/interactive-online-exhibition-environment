import React from "react";
import { Document, Page, Text, Image, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 12 },
  paragraph: { marginBottom: 10 },
  image: { width: 300, height: "auto", marginBottom: 10 },
  heading: { fontSize: 16, marginBottom: 10, fontWeight: "bold" },
});

type ContentElement = JSX.Element | null;

export const generatePDFContent = (htmlContent: string): JSX.Element => {
  const parser = new DOMParser();
  const parsedDocument = parser.parseFromString(htmlContent, "text/html");

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
      case "IMG": // Images
        const src = node.getAttribute("src");
        if (src) {
          return <Image key={Math.random()} style={styles.image} src={src} />;
        }
        return null;
      case "DIV": // Handle nested divs
        return Array.from(node.children)
          .map((childNode, index) => renderContent(childNode as HTMLElement))
          .flat();
      default:
        return null; // Ignore unsupported tags
    }
  };

  const content = Array.from(parsedDocument.body.children)
    .flatMap((node) => renderContent(node as HTMLElement))
    .filter((element): element is JSX.Element => element !== null);

  return (
    <Document>
      <Page style={styles.page}>{content}</Page>
    </Document>
  );
};
