import React, { useEffect } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import QuestionImage from "../question-image";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { Check } from "lucide-react";
import type { Answer, Question } from "~/lib/types/entities";
import { useTranslation } from "react-i18next";

enum QuestionResult {
  CORRECT,
  INCORRECT,
  PARTIAL,
}

type QuestionCardProps = {
  question: Question;
  isSubmitted: boolean;
  isCorrect: boolean;
  onSubmit: (isCorrect: boolean) => void;
  onUnsubmit: () => void;
};

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onSubmit,
  onUnsubmit,
  isSubmitted,
  isCorrect,
}) => {
  const { t } = useTranslation();
  const [selectedAnswers, setSelectedAnswers] = React.useState<Answer[]>([]);
  const [result, setResult] = React.useState<QuestionResult>(
    QuestionResult.INCORRECT,
  );

  const correctAnswers = question.answers.filter((answer) => answer.isCorrect);
  const incorrectAnswers = question.answers.filter(
    (answer) => !answer.isCorrect,
  );

  useEffect(() => {
    if (
      correctAnswers.every((answer) => selectedAnswers.includes(answer)) &&
      incorrectAnswers.every((answer) => !selectedAnswers.includes(answer))
    ) {
      setResult(QuestionResult.CORRECT);
    } else if (
      correctAnswers.some((answer) => selectedAnswers.includes(answer))
    ) {
      setResult(QuestionResult.PARTIAL);
    } else {
      setResult(QuestionResult.INCORRECT);
    }
  }, [selectedAnswers, correctAnswers, incorrectAnswers]);

  function onAnswerToggle(selectedAnswer: Answer) {
    onUnsubmit();
    setSelectedAnswers((prev) =>
      prev.includes(selectedAnswer)
        ? prev.filter((answer) => selectedAnswer !== answer)
        : [...prev, selectedAnswer],
    );
  }

  function handleSubmit() {
    onSubmit(result === QuestionResult.CORRECT);
  }

  return (
    <Card>
      <CardHeader>
        {question.text}
        {question.imageUrl && <QuestionImage src={question.imageUrl} />}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {question.answers.map((answer: Answer, index: number) => (
            <div
              key={index}
              className="flex items-center space-x-2 rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Checkbox
                id={`answer-${index}`}
                checked={selectedAnswers.includes(answer)}
                onCheckedChange={() => onAnswerToggle(answer)}
                disabled={isSubmitted}
              />
              <Label
                htmlFor={`answer-${index}`}
                className="flex-grow cursor-pointer break-words"
              >
                {answer.text}
              </Label>
            </div>
          ))}
        </div>
        {isSubmitted && (
          <FeedBackLabel
            result={
              isCorrect ? QuestionResult.CORRECT : QuestionResult.INCORRECT
            }
            correctAnswers={correctAnswers}
          />
        )}
        <div className="mt-2 flex w-full justify-end">
          <Button type="button" onClick={handleSubmit} disabled={isSubmitted}>
            <Check className="h-4 w-4" /> {t("quizzes.checkAnswer")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const FeedBackLabel: React.FC<{
  result: QuestionResult;
  correctAnswers: Answer[];
}> = ({ result, correctAnswers }) => {
  const { t } = useTranslation();
  switch (result) {
    case QuestionResult.CORRECT:
      return (
        <div className="w-full break-words rounded-md bg-green-100 p-4 text-green-800 dark:bg-green-800 dark:text-green-100">
          {t("quizzes.correct")}
        </div>
      );
    case QuestionResult.INCORRECT:
      return (
        <div className="w-full break-words rounded-md bg-red-100 p-4 text-red-800 dark:bg-red-800 dark:text-red-100">
          {`${t("quizzes.incorrect")} ${correctAnswers.length > 1 ? t("quizzes.correctAnswers") : t("quizzes.correctAnswer")} ${correctAnswers.map((a) => a.text).join(", ")}`}
        </div>
      );
    case QuestionResult.PARTIAL:
      return (
        <div className="w-full break-words rounded-md bg-yellow-100 p-4 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">
          {`${t("quizzes.partiallyCorrect")} ${correctAnswers.length > 1 ? t("quizzes.correctAnswers") : t("quizzes.correctAnswer")} ${correctAnswers.map((a) => a.text).join(", ")}`}
        </div>
      );
    default:
      throw new Error("Unknown question result");
  }
};
