"use client";
import { QuizCard } from "~/components/quiz/quiz";
import { useQuizIdFromParams } from "~/hooks/useExhibitionIdFromParams";
import { api } from "~/trpc/react";


const QuizView = () => {
  const  id = useQuizIdFromParams();

  const { data: quiz, error, isLoading } = api.quiz.getOne.useQuery({ quizId: Number(id) });

  if (error || !quiz) {
    return <div>Error loading quizzes.</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex justify-center items-center my-32">
      <QuizCard quiz={quiz} />
    </main>
  );

}

export default QuizView;