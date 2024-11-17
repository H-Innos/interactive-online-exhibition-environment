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
      const parent = document.getElementById('editor-content');
      if (parent) {
        const divs = parent.querySelectorAll('div[data-file-block]'); // look at data blocks only
        divs.forEach(div => {
          const dataUrl = div.getAttribute('data-url');
          if (!dataUrl) 
            return;

          const oldImg = div.querySelector('img');
          const oldAudio = div.querySelector('audio');

          if (oldImg) {
            const newImg = document.createElement('img');
            for (const attribute of oldImg.attributes) {
              newImg.setAttribute(attribute.name, attribute.value);
            }
            newImg.src = dataUrl;
            oldImg.replaceWith(newImg);
          }

          if (oldAudio) {
            // Also replace audios, same bug            
            const newAudio = document.createElement('audio');
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
    <div className="text-text-dark min-h-screen p-8">
      <div
        className="relative h-64 w-full bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `url(${exhibition.coverImageUrl ?? '/default-cover.jpg'})`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <button
          onClick={() => router.push('/')}
          className="absolute left-4 text-white text-5xl z-10"
        >
          ❬
        </button>
        <h1 className="relative text-4xl font-bold text-white z-10">
          {exhibition.name}
        </h1>
      </div>
      {quizzes && quizzes.length > 0 &&
        <QuizDropdown
          className="mt-4"
          quizzes={quizzes}
          onQuizSelect={(quizId: number) => {
            router.push(`${id}/quizzes/${quizId}`);
          }}
        /> 
        }
      <div id="editor-content" dangerouslySetInnerHTML={{ __html: exhibition.content ?? "" }} className="blocknote-content mt-8" />
    </div>
  );
};

export default ExhibitionViewPage;