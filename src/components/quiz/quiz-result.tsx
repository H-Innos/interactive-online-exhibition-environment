import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";

interface QuizResultProps {
  score: number;
  totalQuestions: number;
  onRetake: () => void;
}

export const QuizResult: React.FC<QuizResultProps> = ({
  score,
  totalQuestions,
  onRetake,
}) => {
  const { t } = useTranslation();
  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          {t("quizzes.result")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <p className="mb-4 text-2xl font-bold">
            {t("quizzes.scoreMessage", { score, totalQuestions })}
          </p>
          <p className="mb-6 text-lg">
            {t("quizzes.scorePercentage", { percentage })}
          </p>
          <Button onClick={onRetake}>{t("quizzes.retakeQuiz")}</Button>
        </div>
      </CardContent>
    </Card>
  );
};
