"use client";
import { useTranslation } from "react-i18next";
import { QuizCard } from "~/components/quiz/quiz";
import { useQuizIdFromParams } from "~/hooks/useExhibitionIdFromParams";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

const QuizView = () => {
  const { t } = useTranslation();
  const id = useQuizIdFromParams();
  const router = useRouter();

  const {
    data: quiz,
    error: quizError,
    isLoading: isQuizLoading,
  } = api.quiz.getOne.useQuery({ quizId: Number(id) });

  const {
    data: exhibition,
    error: exhibitionError,
    isLoading: isExhibitionLoading,
  } = api.exhibition.getOne.useQuery({
    id: quiz?.exhibitionId ?? 0,
  });

  const isLoading = isQuizLoading || isExhibitionLoading;

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-xl">{t("mainPage.loading")}</div>
      </main>
    );
  }

  if (quizError || !quiz || exhibitionError || !exhibition) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-xl text-red-600">{t("quizzes.errorLoading")}</div>
      </main>
    );
  }

  return (
    <main
      className="flex min-h-screen items-center justify-center"
      style={{
        backgroundColor: exhibition.backgroundColor ?? "#ffffff",
      }}
    >
      <button
        onClick={() => router.push(`/${quiz.exhibitionId}`)}
        className="absolute left-4 top-32 z-10 text-3xl text-black sm:text-4xl"
      >
        ❬
      </button>
      <div className="mt-[-150px] w-full max-w-3xl p-4">
        <QuizCard quiz={quiz} />
      </div>
    </main>
  );
};

export default QuizView;
