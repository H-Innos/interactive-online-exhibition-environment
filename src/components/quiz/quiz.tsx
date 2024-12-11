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
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import type { Question, Quiz } from "~/lib/types/entities";
import { useTranslation } from "react-i18next";
import { QuizResult } from "./quiz-result";

export const QuizCard: React.FC<{ quiz: Quiz }> = ({ quiz }) => {
  const { t } = useTranslation();
  const [questionsState, setQuestionsState] = useState<
    { question: Question; isSubmitted: boolean; isCorrect: boolean }[]
  >(
    quiz.questions.map((q) => ({
      question: q,
      isSubmitted: false,
      isCorrect: false,
    })),
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [currentQuestionState, setCurrentQuestionState] = useState<
    { question: Question; isSubmitted: boolean; isCorrect: boolean } | undefined
  >(questionsState[currentQuestionIndex]);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);

  useEffect(() => {
    setCurrentQuestionState(questionsState[currentQuestionIndex]);
  }, [currentQuestionIndex, questionsState]);

  function handleSubmit(isCorrect: boolean) {
    setQuestionsState(
      questionsState.map((q, index) =>
        index === currentQuestionIndex
          ? { ...q, isSubmitted: true, isCorrect }
          : q,
      ),
    );

    if (currentQuestionIndex === quiz.questions.length - 1) {
      setIsQuizCompleted(true);
    }
  }

  function handleUnsubmit() {
    setQuestionsState(
      questionsState.map((q, index) =>
        index === currentQuestionIndex
          ? { ...q, isSubmitted: false, isCorrect: false }
          : q,
      ),
    );
  }

  function calculateScore() {
    return questionsState.filter((q) => q.isCorrect).length;
  }

  function handleRetake() {
    setQuestionsState(
      quiz.questions.map((q) => ({
        question: q,
        isSubmitted: false,
        isCorrect: false,
      })),
    );
    setCurrentQuestionIndex(0);
    setIsQuizCompleted(false);
    setShowResults(false);
  }

  function handleFinishQuiz() {
    setShowResults(true);
  }

  if (showResults) {
    return (
      <QuizResult
        score={calculateScore()}
        totalQuestions={quiz.questions.length}
        onRetake={handleRetake}
      />
    );
  }

  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader className="border-b">
        <CardTitle className="text-xl font-bold">{quiz.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {currentQuestionState && (
          <QuestionCard
            question={currentQuestionState.question}
            isSubmitted={currentQuestionState.isSubmitted}
            isCorrect={currentQuestionState.isCorrect}
            onSubmit={handleSubmit}
            onUnsubmit={handleUnsubmit}
          />
        )}
      </CardContent>
      <CardFooter className="flex justify-between p-4">
        <Button
          onClick={() =>
            setCurrentQuestionIndex((prevIndex) => Math.max(0, prevIndex - 1))
          }
          disabled={currentQuestionIndex === 0}
          variant="outline"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> {t("pagination.previous")}
        </Button>
        {isQuizCompleted ? (
          <Button onClick={handleFinishQuiz} variant="default">
            <CheckCircle className="mr-2 h-4 w-4" /> {t("quizzes.finishQuiz")}
          </Button>
        ) : (
          <Button
            onClick={() =>
              setCurrentQuestionIndex((prevIndex) =>
                Math.min(quiz.questions.length - 1, prevIndex + 1),
              )
            }
            disabled={
              currentQuestionIndex === quiz.questions.length - 1 ||
              !currentQuestionState?.isSubmitted
            }
            variant="outline"
          >
            {t("pagination.next")} <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
