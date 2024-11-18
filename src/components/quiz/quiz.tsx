"use client";
import type React from "react";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { QuestionCard } from "./question";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Question, Quiz } from "~/lib/types/entities";
import { t } from "i18next";

export const QuizCard: React.FC<{ quiz: Quiz }> = ({ quiz }) => {
  const [questionsState, setQuestionsState] = useState<
    { question: Question; isSubmitted: boolean }[]
  >(quiz.questions.map((q) => ({ question: q, isSubmitted: false })));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [currentQuestionState, setCurrentQuestionState] = useState<
    { question: Question; isSubmitted: boolean } | undefined
  >(questionsState[currentQuestionIndex]);

  useEffect(() => {
    setCurrentQuestionState(questionsState[currentQuestionIndex]);
  }, [currentQuestionIndex, questionsState]);

  function handleSubmit() {
    setQuestionsState(
      questionsState.map((q, index) => {
        if (index === currentQuestionIndex) {
          return { ...q, isSubmitted: true };
        }
        return q;
      }),
    );
  }

  function handleUnsubmit() {
    setQuestionsState(
      questionsState.map((q, index) => {
        if (index === currentQuestionIndex) {
          return { ...q, isSubmitted: false };
        }
        return q;
      }),
    );
  }

  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <CardTitle>{quiz.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <QuestionCard
          question={currentQuestionState!.question}
          isSubmitted={currentQuestionState!.isSubmitted}
          onSubmit={handleSubmit}
          onUnsubmit={handleUnsubmit}
        />
      </CardContent>
      <CardFooter className="flex w-full flex-row justify-between p-6">
        <Button
          onClick={() =>
            setCurrentQuestionIndex((prevIndex) => Math.max(0, prevIndex - 1))
          }
          disabled={currentQuestionIndex === 0}
          variant="outline"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> {t("pagination.previous")}
        </Button>
        <Button
          onClick={() =>
            setCurrentQuestionIndex((prevIndex) =>
              Math.min(quiz.questions.length - 1, prevIndex + 1),
            )
          }
          disabled={currentQuestionIndex === quiz.questions.length - 1}
          variant="outline"
        >
          {t("pagination.next")} <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
