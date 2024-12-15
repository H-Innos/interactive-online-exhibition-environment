"use client";

import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import React, { useEffect, useState } from "react";
import { type Exhibition } from "~/lib/types/entities";
import { useExhibitionIdFromParams } from "~/hooks/useExhibitionIdFromParams";
import { QuizDropdown } from "~/components/quiz-dropdown";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";
import "~/styles/colors.css";
import { configurations } from "~/lib/constants/config";
import { Button } from "~/components/ui/button";
import { Download } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { pdf } from "@react-pdf/renderer";
import { generatePDFContent } from "~/lib/utils/pdfUtils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";

const ExhibitionViewPage: React.FC = () => {
  const id = useExhibitionIdFromParams();
  const router = useRouter();
  const [exhibition, setExhibition] = useState<Exhibition | null>(null);
  const { t } = useTranslation();

  const { data, error, isLoading } = api.exhibition.getOne.useQuery({ id: id });
  const { data: quizzes } = api.quiz.getAllByExhibitionId.useQuery({
    exhibitionId: id,
  });

  useEffect(() => {
    if (data) {
      console.log("API Response:", data);
      setExhibition(data);
    }

    if (exhibition) {
      // Set image sizes after they've been rendered (for lightbox)
      document.querySelectorAll("a.gallery-img").forEach((link) => {
        const img = link.querySelector("img");
        if (img) {
          img.onload = (e) => {
            link.setAttribute("data-pswp-width", img.naturalWidth.toString());
            link.setAttribute("data-pswp-height", img.naturalHeight.toString());
          };
        }
      });

      const lightbox = new PhotoSwipeLightbox({
        gallery: "#editor-content",
        children: "a.gallery-img",
        pswpModule: () => import("photoswipe"),
      });
      lightbox.init();

      return () => {
        lightbox.destroy();
      };
    }
  }, [exhibition, data]);

  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      if (exhibition) {
        // Normalize fields for compatibility
        const normalizedExhibition = {
          ...exhibition,
          description: exhibition.description ?? "No description available.",
          updatedAt: exhibition.updatedAt
            ? new Date(exhibition.updatedAt).toLocaleDateString()
            : "Date not available",
          createdAt: exhibition.createdAt
            ? new Date(exhibition.createdAt).toLocaleDateString()
            : "Date not available",
          content: exhibition.content ?? "No content available.",
        };

        // Generate the PDF document
        const pdfContent = generatePDFContent(normalizedExhibition);

        // Convert the React-PDF document to a Blob
        const blob = await pdf(pdfContent).toBlob();

        // Trigger download
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${exhibition.name?.replace(/\s+/g, "_") || "Untitled_Exhibition"}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast.success("PDF downloaded started");
      } else {
        throw new Error("Exhibition data is missing or invalid.");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Error generating PDF");
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error || !exhibition) {
    return (
      <div className="flex h-screen items-center justify-center text-red-600">
        Error loading exhibition.
      </div>
    );
  }

  const backgroundImage =
    exhibition.exhibitionCoverUrl && exhibition.exhibitionCoverUrl.trim() !== ""
      ? exhibition.exhibitionCoverUrl
      : exhibition.thumbnailUrl
        ? exhibition.thumbnailUrl
        : configurations.DEFAULT_COVER_IMAGE_URL;

  return (
    <div
      className="relative min-h-screen overflow-hidden text-text-dark"
      style={{ backgroundColor: exhibition.backgroundColor ?? "#ffffff" }}
    >
      <div
        className="relative flex h-48 w-full items-center justify-center overflow-hidden bg-cover bg-center sm:h-64"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundPosition: `${
            exhibition.coverImagePositionX ??
            configurations.DEFAULT_EXHIBITION_COVER_PLACEMENT
          }% ${
            exhibition.coverImagePositionY ??
            configurations.DEFAULT_EXHIBITION_COVER_PLACEMENT
          }%`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <button
          onClick={() => router.push("/")}
          className="absolute left-4 top-1/2 z-10 -translate-y-1/2 transform bg-transparent p-2 text-white sm:p-3 sm:text-4xl"
        >
          <span className="text-3xl sm:text-4xl">❬</span>
        </button>
        <h1 className="z-5 relative px-4 text-center text-lg font-bold text-white sm:text-2xl lg:text-3xl">
          {exhibition.name}
        </h1>
      </div>

      <div className="flex flex-col p-4">
        <div className="mb-4 flex items-center justify-end">
          {quizzes && quizzes.length > 0 && (
            <QuizDropdown
              quizzes={quizzes}
              onQuizSelect={(quizId: number) => {
                router.push(`${id}/quizzes/${quizId}`);
              }}
            />
          )}

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleDownloadPDF}
                  disabled={isDownloading}
                  aria-label={t("downloadExhibitionPDF")}
                  className="ml-2 h-12 w-12 p-2"
                  variant="outline"
                >
                  {isDownloading ? (
                    <span className="animate-spin text-lg">⌛</span>
                  ) : (
                    <Download className="h-6 w-6" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("downloadExhibitionPDF")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex-1">
          <div
            id="editor-content"
            dangerouslySetInnerHTML={{ __html: exhibition.content ?? "" }}
            className="blocknote-content max-w-full break-words text-sm sm:text-base lg:text-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default ExhibitionViewPage;
