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
      setExhibition(data);
    }
  }, [data]);

  const [isDownloading, setIsDownloading] = useState(false);
  const downloadExhibitionPDF = api.pdf.generateExhibitionPDF.useMutation();

  function handleDownloadPDF(exhibitionId: number) {
    setIsDownloading(true);
    downloadExhibitionPDF.mutate(
      { exhibitionId },
      {
        onSuccess: (data) => {
          try {
            const blob = new Blob([Buffer.from(data.pdfBuffer, "base64")], {
              type: "application/pdf",
            });
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = data.fileName;
            link.click();
            window.URL.revokeObjectURL(link.href);
            setIsDownloading(false);
            toast.success("PDF downloaded successfully");
          } catch (error) {
            console.error("Error creating PDF blob:", error);
            toast.error("Failed to create PDF download");
            setIsDownloading(false);
          }
        },
        onError: (error) => {
          console.error("Error downloading PDF:", error);
          toast.error("Failed to generate PDF");
          setIsDownloading(false);
        },
      },
    );
  }

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
      className="min-h-screen overflow-hidden text-text-dark"
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
        <h1 className="relative z-10 px-4 text-center text-lg font-bold text-white sm:text-2xl lg:text-3xl">
          {exhibition.name}
        </h1>
      </div>

      <div className="mt-8 flex flex-col gap-4 p-4 sm:flex-row sm:gap-8 sm:p-8">
        <div className="flex-1">
          <div
            id="editor-content"
            dangerouslySetInnerHTML={{ __html: exhibition.content ?? "" }}
            className="blocknote-content max-w-full break-words text-sm sm:text-base lg:text-lg"
          />
        </div>

        {quizzes && quizzes.length > 0 && (
          <div className="max-w-full sm:ml-4">
            <QuizDropdown
              quizzes={quizzes}
              onQuizSelect={(quizId: number) => {
                router.push(`${id}/quizzes/${quizId}`);
              }}
            />
          </div>
        )}
        <Button
          onClick={() => handleDownloadPDF(exhibition.id)}
          disabled={isDownloading}
        >
          {isDownloading ? "Downloading..." : "Download Exhibition PDF"}
        </Button>
      </div>
    </div>
  );
};

export default ExhibitionViewPage;
