"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { QuestionCreator } from "./question-creator";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useCreateQuiz } from "~/hooks/quiz-actions";
import { uploadImage } from "~/lib/utils/image-uploader";
import { Input } from "../ui/input";
import { useExhibitionIdFromParams } from "~/hooks/useExhibitionIdFromParams";
import type { CreateQuizDTO, CreateQuestionDTO } from "~/lib/types/schemas";
import { generateEmptyQuestion } from "~/lib/utils/quiz-utils";
import { useTranslation } from "react-i18next";
import { useEditQuiz } from "~/hooks/quiz-actions";

type QuizCreatorProps = {
  creatorContent: CreateQuizDTO | null;
  disabled: boolean;
  onCreate: () => void;
  onEdit?: (quizId: number) => void;
  isEditMode?: boolean;
  quizId?: number;
};

export default function QuizCreator({
  creatorContent,
  disabled,
  onCreate,
  onEdit,
  isEditMode = false,
  quizId,
}: QuizCreatorProps) {
  const { t } = useTranslation();
  const exhibitionId = useExhibitionIdFromParams();
  const createQuiz = useCreateQuiz();
  const editQuiz = useEditQuiz();

  const [title, setTitle] = useState<string>("");
  const [questions, setQuestions] = useState<CreateQuestionDTO[]>([
    generateEmptyQuestion(exhibitionId),
  ]);

  useEffect(() => {
    if (creatorContent) {
      setTitle(creatorContent.title);
      setQuestions(creatorContent.questions);
    }
  }, [creatorContent]);

  const updateQuestion = (updatedQuestion: CreateQuestionDTO) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === updatedQuestion.id ? updatedQuestion : q,
      ),
    );
  };

  const deleteQuestion = (id: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  const addQuestion = () => {
    const newQuestion: CreateQuestionDTO = generateEmptyQuestion(exhibitionId);
    setQuestions([...questions, newQuestion]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (questions.every((q) => q.answers.some((a) => a.isCorrect))) {
      for (const question of questions) {
        if (!question.imageUrl) continue;
        question.imageUrl = await uploadImage(question.imageUrl);
      }

      const quizData = {
        title: title,
        exhibitionId: Number(exhibitionId),
        questions: questions.map((q) => ({
          text: q.text,
          imageUrl: q.imageUrl,
          answers: q.answers.map((a) => ({
            text: a.text,
            isCorrect: a.isCorrect,
          })),
        })),
      };

      if (isEditMode && quizId) {
        await editQuiz.mutate(quizId, quizData);
        if (onEdit) onEdit(quizId);
      } else {
        createQuiz.mutate(quizData);
        onCreate();
      }
    } else {
      alert(t("quizzes.noCorrectAnswersSpecified"));
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl p-4">
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>
              <Input
                id={`title-${title}`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("quizzes.titlePlaceholder")}
                required
                readOnly={disabled}
                data-testid="quiz-title-input"
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {questions.map((question, index) => (
                <QuestionCreator
                  key={question.id}
                  order={index}
                  question={question}
                  onUpdate={updateQuestion}
                  onDelete={() => deleteQuestion(question.id!)}
                  disabled={disabled}
                />
              ))}
            </div>
            <div className="mt-4 flex justify-between">
              <Button type="button" onClick={addQuestion} disabled={disabled}>
                <Plus className="mr-2 h-4 w-4" />
                {t("quizzes.addQuestion")}
              </Button>
              <Button
                type="submit"
                disabled={disabled}
                data-testid="save-quiz-changes-button"
              >
                {isEditMode
                  ? t("quizzes.saveChanges")
                  : t("quizzes.createQuiz")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
