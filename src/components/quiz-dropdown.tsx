'use client'

import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { ChevronDown, Play } from 'lucide-react'
import { type Quiz } from '~/lib/types/entities'

interface QuizDropdownProps {
  quizzes: Quiz[]
  onQuizSelect: (quizId: number) => void
}

export function QuizDropdown({ 
  quizzes,
  onQuizSelect
}: QuizDropdownProps) {

  const handleSelectQuiz = (quiz: Quiz) => {
    onQuizSelect(quiz.id);
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-64">
            Activities
            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64" align="center">
          <DropdownMenuLabel>Available Quizzes</DropdownMenuLabel>
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
  )
}