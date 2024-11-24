"use client";

import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import React, { useEffect, useState } from "react";
import { type Exhibition } from "~/lib/types/entities";
import { useExhibitionIdFromParams } from "~/hooks/useExhibitionIdFromParams";
import { QuizDropdown } from "~/components/quiz-dropdown";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";

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

    }, [data, exhibition]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !exhibition) {
    return <div>Error loading exhibition.</div>;
  }

  return (
    <div 
      className="min-h-screen p-4 text-text-dark sm:p-8"
      style={{ backgroundColor: exhibition.backgroundColor ?? "#ffffff" }}>
      <div
        className="relative flex h-48 w-full items-center justify-center bg-cover bg-center sm:h-64"
        style={{
          backgroundImage: `url(${exhibition.coverImageUrl ?? "/default-cover.jpg"})`,
          backgroundPosition: `${exhibition.coverImagePositionX ?? 50}% ${exhibition.coverImagePositionY ?? 50}%`, // Use saved position
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <button
          onClick={() => router.push("/")}
          className="absolute left-4 z-10 text-3xl text-white sm:text-5xl"
        >
          ❬
        </button>
        <h1 className="relative z-10 text-center text-xl font-bold text-white sm:text-3xl lg:text-5xl">
          {exhibition.name}
        </h1>
      </div>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <div
            id="editor-content"
            dangerouslySetInnerHTML={{ __html: exhibition.content ?? "" }}
            className="blocknote-content break-words"
          />
        </div>

        {quizzes && quizzes.length > 0 && (
          <div className="sm:ml-4">
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
