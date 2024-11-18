"use client";

import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import React, { useEffect, useState } from "react";
import { type Exhibition } from "~/lib/types/entities";
import { useExhibitionIdFromParams } from "~/hooks/useExhibitionIdFromParams";
import { QuizDropdown } from "~/components/quiz-dropdown";

const ExhibitionViewPage: React.FC = () => {
  const id = useExhibitionIdFromParams();
  const router = useRouter();
  const [exhibition, setExhibition] = useState<Exhibition | null>(null);

  const { data, error, isLoading } = api.exhibition.getOne.useQuery({ id: id });
  const { data: quizzes } = api.quiz.getAllByExhibitionId.useQuery({ exhibitionId: id });

  useEffect(() => {
    if (data) {
      setExhibition(data);
    }

    if (exhibition) {
      // Create img src with data-url; Blocknote bug
      const parent = document.getElementById("editor-content");
      if (parent) {
        const divs = parent.querySelectorAll("div[data-file-block]"); // look at data blocks only
        divs.forEach((div) => {
          const dataUrl = div.getAttribute("data-url");
          if (!dataUrl) return;

          const oldImg = div.querySelector("img");
          const oldAudio = div.querySelector("audio");

          if (oldImg) {
            const newImg = document.createElement("img");
            for (const attribute of oldImg.attributes) {
              newImg.setAttribute(attribute.name, attribute.value);
            }
            newImg.src = dataUrl;
            oldImg.replaceWith(newImg);
          }

          if (oldAudio) {
            // Also replace audios, same bug
            const newAudio = document.createElement("audio");
            for (const attribute of oldAudio.attributes) {
              newAudio.setAttribute(attribute.name, attribute.value);
            }
            newAudio.src = dataUrl;
            oldAudio.replaceWith(newAudio);
          }
        });
      }
    }
  }, [data, exhibition]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !exhibition) {
    return <div>Error loading exhibition.</div>;
  }

  return (
    <div className="text-text-dark min-h-screen p-4 sm:p-8">
      <div
        className="relative h-48 sm:h-64 w-full bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `url(${exhibition.coverImageUrl ?? "/default-cover.jpg"})`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <button
          onClick={() => router.push("/")}
          className="absolute left-4 text-white text-3xl sm:text-5xl z-10"
        >
          ❬
        </button>
        <h1 className="relative text-xl sm:text-3xl lg:text-5xl font-bold text-white z-10 text-center">
          {exhibition.name}
        </h1>
      </div>

      <div className="flex flex-col sm:flex-row mt-8 gap-4">
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

      <style jsx global>{`
        .blocknote-content img,
        .blocknote-content video,
        .blocknote-content iframe {
          max-width: 100%;
          height: auto;
          display: block;
        }
        .blocknote-content {
          word-wrap: break-word;
        }
      `}</style>
    </div>
  );
};

export default ExhibitionViewPage;