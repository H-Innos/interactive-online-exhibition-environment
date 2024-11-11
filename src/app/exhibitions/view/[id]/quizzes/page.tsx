"use client";

import React from 'react'
import { QuizCard } from '~/components/quiz/quiz';
import useExhibitionIdFromParams from '~/hooks/useExhibitionIdFromParams';
import { api } from '~/trpc/react';

const QuizzesView = () => {
  const id = useExhibitionIdFromParams();
  const { data: quizzes, error, isLoading } = api.quiz.getAllByExhibitionId.useQuery({ exhibitionId: Number(id) });

  if (error) {
    return <div>Error loading quizzes.</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!quizzes || quizzes.length === 0) {
    return <div>There are currently no quizzes.</div>;
  }

  return (
    <div className='flex flex-col items-center gap-2'>
      {quizzes?.map((quiz) => (
        <QuizCard
        key={quiz.id} 
        title={quiz.title}
        exhibitionId={quiz.exhibitionId}
        questions={quiz.questions}
        />
      ))}
    </div>
  )
};

export default QuizzesView;