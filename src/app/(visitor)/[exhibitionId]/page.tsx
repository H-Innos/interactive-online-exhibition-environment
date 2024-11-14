"use client";

import { api } from "~/trpc/react";
import React from "react";

import 'ckeditor5/ckeditor5.css';
import { useRouter } from "next/navigation";
import { QuizDropdown } from "~/components/quiz-dropdown";
import useExhibitionIdFromParams from "~/hooks/useExhibitionIdFromParams";

const ExhibitionViewPage: React.FC = () => {
  const router = useRouter();
  const exhibitionId = useExhibitionIdFromParams();

  const { data: exhibition, error: exhibitionError, isLoading: exhibitionLoading } = api.exhibition.getOne.useQuery({ id: Number(exhibitionId) });
  const { data: quizzes } = api.quiz.getAllByExhibitionId.useQuery({ exhibitionId: Number(exhibitionId) });

  if (exhibitionLoading) {
    return <div>Loading...</div>;
  }

  if (exhibitionError || !exhibition) {
    return <div>Error loading exhibition.</div>;
  }

  return (
    <div className="text-text-dark min-h-screen p-8">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4 text-center">{exhibition.name}</h1>
        {quizzes && quizzes.length > 0 &&
        <QuizDropdown
          quizzes={quizzes}
          onQuizSelect={(quizId: number) => {
            router.push(`${exhibitionId}/quizzes/${quizId}`);
          }}
        /> 
        }
        
      </div>
      <div dangerouslySetInnerHTML={{ __html: exhibition.content ?? "" }} className="ck-content" />
    </div>
  );
};

export default ExhibitionViewPage;