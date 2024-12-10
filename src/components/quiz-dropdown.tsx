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
import { useState, useRef } from "react";

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
  const [isOpen, setIsOpen] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSelectQuiz = (quiz: Quiz) => {
    onQuizSelect(quiz.id);
    setIsOpen(false);
  };

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 500);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <div
        className={cn("flex flex-col items-center space-y-2", className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="text-md h-12 w-72">
            {t("quizzes.activities")}
            <ChevronDown className="ml-2 h-5 w-5 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-72" align="center">
          <DropdownMenuLabel>{t("quizzes.quizzes")}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {quizzes.map((quiz) => (
            <DropdownMenuItem
              key={quiz.id}
              onSelect={() => handleSelectQuiz(quiz)}
              className="flex items-center justify-between"
            >
              {quiz.title}
              <Play className="h-5 w-5 opacity-50" />
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </div>
    </DropdownMenu>
  );
}
