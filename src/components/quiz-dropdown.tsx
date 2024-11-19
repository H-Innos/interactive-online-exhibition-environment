"use client";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { ChevronDown, Play } from "lucide-react";
import { type Quiz } from "~/lib/types/entities";
import { t } from "i18next";
import { cn } from "~/lib/utils";

interface QuizDropdownProps {
  quizzes: Quiz[];
  onQuizSelect: (quizId: number) => void;
  className?: string;
}

export function QuizDropdown({
  quizzes,
  onQuizSelect,
  className,
}: QuizDropdownProps) {
  const handleSelectQuiz = (quiz: Quiz) => {
    onQuizSelect(quiz.id);
  };

  return (
    <div className={cn("flex flex-col items-center space-y-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-64">
            {t("quizzes.activities")}
            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64" align="center">
          <DropdownMenuLabel>{t("quizzes.quizzes")}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {quizzes.map((quiz) => (
            <DropdownMenuItem
              key={quiz.id}
              onSelect={() => handleSelectQuiz(quiz)}
              className="flex items-center justify-between"
            >
              {quiz.title}
              <Play className="h-4 w-4 opacity-50" />
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
