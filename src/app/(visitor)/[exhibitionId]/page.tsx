"use client";

import { api } from "~/trpc/react";
import React from "react";

import 'ckeditor5/ckeditor5.css';
import { useRouter } from "next/navigation";
import { QuizDropdown } from "~/components/quiz-dropdown";
import { useExhibitionIdFromParams } from "~/hooks/useExhibitionIdFromParams";

const ExhibitionViewPage: React.FC = () => {
  const router = useRouter();
  const exhibitionId = useExhibitionIdFromParams();

  const { data: exhibition, error: exhibitionError, isLoading: exhibitionLoading } = api.exhibition.getOne.useQuery({ id: exhibitionId });
  const { data: quizzes } = api.quiz.getAllByExhibitionId.useQuery({ exhibitionId: exhibitionId });

  if (exhibitionLoading) {
    return <div>Loading...</div>;
  }

  if (exhibitionError || !exhibition) {
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
            router.push(`${exhibitionId}/quizzes/${quizId}`);
          }}
        /> 
        }
      <div dangerouslySetInnerHTML={{ __html: exhibition.content ?? "" }} className="ck-content mt-8" />
    </div>

  );
};

export default ExhibitionViewPage;