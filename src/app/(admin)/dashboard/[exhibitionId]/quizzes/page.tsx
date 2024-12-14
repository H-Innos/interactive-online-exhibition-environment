"use client";
import { Plus, Trash2, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import QuizCreator from "~/components/quiz/quiz-creator";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { useDeleteQuiz } from "~/hooks/quiz-actions";
import { useExhibitionIdFromParams } from "~/hooks/useExhibitionIdFromParams";
import { type CreateQuizDTO } from "~/lib/types/schemas";
import { generateEmptyQuiz } from "~/lib/utils/quiz-utils";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

const QuizzesPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const id = useExhibitionIdFromParams();
  const {
    data: existingQuizzes,
    error,
    isLoading,
  } = api.quiz.getAllByExhibitionId.useQuery({ exhibitionId: Number(id) });
  const [quizzes, setQuizzes] = useState<CreateQuizDTO[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<CreateQuizDTO | null>(null);
  const [isEditable, setIsEditable] = useState(false);

  const deleteQuiz = useDeleteQuiz();

  useEffect(() => {
    if (existingQuizzes) {
      setQuizzes(existingQuizzes);
    }
  }, [existingQuizzes]);

  function handleSelect(quiz: CreateQuizDTO) {
    setSelectedQuiz(quiz);
    setIsEditable(false);
  }

  function handleDelete(id: number) {
    deleteQuiz.mutate({ quizId: id });
  }

  function handleCancel() {
    setIsEditable(false);
    setSelectedQuiz(null);
  }

  function handleNewQuiz() {
    setIsEditable(true);
    setSelectedQuiz(generateEmptyQuiz(id));
  }

  function handleEdit(quiz: CreateQuizDTO) {
    setSelectedQuiz(quiz);
    setIsEditable(true);
  }

  return (
    <main className="flex flex-col gap-4 p-4 md:flex-row">
      <div className="mt-4 flex items-center md:mt-12">
        <button
          onClick={() => router.push(`/dashboard/${id}`)}
          className="mb-4 mr-4 rounded-md text-2xl text-black transition duration-300 hover:text-gray-500 md:mb-10 md:text-4xl"
        >
          ❬
        </button>
      </div>
      <Card className="w-full md:w-1/3">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg md:text-xl">
            {t("quizzes.quizzes")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && <div>{t("quizzes.errorLoading")}</div>}
          {!quizzes.length && <p>{t("quizzes.noQuizzes")}</p>}
          {isLoading && <div>Loading...</div>}
          <ul className="space-y-1">
            {quizzes.map((quiz) => (
              <li key={quiz.id}>
                <div className="flex items-center justify-between py-2">
                  <button
                    className="text-left font-medium hover:underline"
                    onClick={() => handleSelect(quiz)}
                  >
                    {quiz.title}
                  </button>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(quiz)}
                      aria-label={`Edit ${quiz.title}`}
                    >
                      ✎
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(quiz.id!)}
                      aria-label={`Delete ${quiz.title}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Separator />
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <NewQuizButton onClick={handleNewQuiz} />
          </div>
        </CardContent>
      </Card>
      <Card className="w-full md:w-2/3">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg md:text-xl">
            {isEditable
              ? t("quizzes.editQuizTitle", { title: selectedQuiz?.title })
              : t("quizzes.quizPreview")}
          </CardTitle>
          {selectedQuiz && isEditable && (
            <CancelButton onClick={handleCancel} />
          )}
        </CardHeader>
        <CardContent>
          {selectedQuiz ? (
            <QuizCreator
              creatorContent={selectedQuiz}
              disabled={!isEditable}
              onCreate={() => {
                setIsEditable(false);
                setSelectedQuiz(null);
              }}
              onEdit={() => {
                setIsEditable(false);
                setSelectedQuiz(null);
              }}
              isEditMode={isEditable}
              quizId={selectedQuiz?.id}
            />
          ) : (
            <div className="flex min-h-[200px] w-full items-center justify-center">
              {t("quizzes.noQuizSelected")}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
};

const CancelButton = ({ onClick }: { onClick: () => void }) => {
  const { t } = useTranslation();
  return (
    <Button onClick={onClick}>
      {" "}
      <>
        <X />
        {t("cancel")}
      </>
    </Button>
  );
};

const NewQuizButton = ({ onClick }: { onClick: () => void }) => {
  const { t } = useTranslation();
  return (
    <Button onClick={onClick}>
      {" "}
      <>
        <Plus className="h-4 w-4" />
        {t("quizzes.newQuiz")}
      </>
    </Button>
  );
};

export default QuizzesPage;
