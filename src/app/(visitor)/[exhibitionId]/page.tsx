"use client";

import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import React, { useEffect, useState } from "react";
import { type Exhibition } from "~/lib/types/entities";
import { useExhibitionIdFromParams } from "~/hooks/useExhibitionIdFromParams";
import { QuizDropdown } from "~/components/quiz-dropdown";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";
import { configurations } from "~/lib/constants/config";

const ExhibitionViewPage: React.FC = () => {
  const id = useExhibitionIdFromParams();
  const router = useRouter();
  const [exhibition, setExhibition] = useState<Exhibition | null>(null);

  const { data, error, isLoading } = api.exhibition.getOne.useQuery({ id: id });
  const { data: quizzes } = api.quiz.getAllByExhibitionId.useQuery({
    exhibitionId: id,
  });

  useEffect(() => {
    if (data) {
      setExhibition(data);
    }
  }, [data]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error || !exhibition) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600">
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
      className="min-h-screen overflow-hidden p-4 text-text-dark sm:p-8"
      style={{ backgroundColor: exhibition.backgroundColor ?? "#ffffff" }}
    >
      <div
        className="relative flex h-48 w-full items-center justify-center bg-cover bg-center sm:h-64 overflow-hidden"
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
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-3xl text-white sm:text-4xl"
        >
          ❬
        </button>
        <h1 className="relative z-10 text-center text-lg font-bold text-white sm:text-2xl lg:text-3xl px-4">
          {exhibition.name}
        </h1>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:gap-8">
        <div className="flex-1">
          <div
            id="editor-content"
            dangerouslySetInnerHTML={{ __html: exhibition.content ?? "" }}
            className="blocknote-content break-words text-sm sm:text-base lg:text-lg max-w-full"
          />
        </div>

        {quizzes && quizzes.length > 0 && (
          <div className="sm:ml-4 max-w-full">
            <QuizDropdown
              quizzes={quizzes}
              onQuizSelect={(quizId: number) => {
                router.push(`${id}/quizzes/${quizId}`);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ExhibitionViewPage;