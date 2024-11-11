"use client";
import type React from "react"
import { useEffect, useState } from "react";
import type { Question, Quiz } from "~/lib/types/schemas"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { QuestionCard } from "./question";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const QuizCard: React.FC<Quiz> = ({ title, questions }) => {
  const [questionsState, setQuestionsState] = useState<{question: Question, isSubmitted: boolean}[]>(
    questions.map(q => ({ question: q, isSubmitted: false }))
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestionState, setCurrentQuestionState] = useState(questionsState[currentQuestionIndex]);
  
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
      })
    )
  };

  function handleUnsubmit() {
    setQuestionsState(
      questionsState.map((q, index) => {
        if (index === currentQuestionIndex) {
          return { ...q, isSubmitted: false };
        }
        return q;
      })
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <QuestionCard 
          question={currentQuestionState!.question}
          isSubmitted={currentQuestionState!.isSubmitted}
          onSubmit={handleSubmit}
          onUnsubmit={handleUnsubmit}
        /> 
      </CardContent>
      <CardFooter className="flex justify-between p-6">
        <Button 
          onClick={() => setCurrentQuestionIndex((prevIndex) => Math.max(0, prevIndex - 1))}
          disabled={currentQuestionIndex === 0}
          variant="outline"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        <Button 
          onClick={() => setCurrentQuestionIndex((prevIndex) => Math.min(questions.length - 1, prevIndex + 1))}
          disabled={currentQuestionIndex === questions.length - 1}
          variant="outline"
        >
          Next <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );    
}