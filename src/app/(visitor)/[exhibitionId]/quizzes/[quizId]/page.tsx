"use client";
import { useTranslation } from "react-i18next";
import { QuizCard } from "~/components/quiz/quiz";
import { useQuizIdFromParams } from "~/hooks/useExhibitionIdFromParams";
import { api } from "~/trpc/react";

const QuizView = () => {
  const { t } = useTranslation();
  const id = useQuizIdFromParams();

  const {
    data: quiz,
    error,
    isLoading,
  } = api.quiz.getOne.useQuery({ quizId: Number(id) });

  if (error || !quiz) {
    return <div>{t("quizzes.errorLoading")}</div>;
  }

  if (isLoading) {
    return <div>{t("mainPage.loading")}</div>;
  }

  return (
    <main className="my-32 flex items-center justify-center">
      <QuizCard quiz={quiz} />
    </main>
  );
};

export default QuizView;
