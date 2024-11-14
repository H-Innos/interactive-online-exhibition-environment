"use client";
import { useParams } from "next/navigation";
import { QuizCard } from "~/components/quiz/quiz";
import { api } from "~/trpc/react";


const QuizView = () => {
  const  { quizId: id } = useParams();

  const { data: quiz, error, isLoading } = api.quiz.getOne.useQuery({ quizId: Number(id) });

  if (error || !quiz) {
    return <div>Error loading quizzes.</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center">
      <QuizCard quiz={quiz} />
      </div>
  );

}

export default QuizView;