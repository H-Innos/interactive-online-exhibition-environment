"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { QuestionCreator } from "./question-creator"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { useCreateQuiz } from "~/hooks/quiz-actions"
import { uploadImage } from "~/lib/utils/image-uploader"
import { useRouter } from "next/navigation"
import { Input } from "../ui/input"
import { type Question } from "~/lib/types/schemas"
import useExhibitionIdFromParams from "~/hooks/useExhibitionIdFromParams"


function generateId() {
  return Date.now();
}

function generateEmptyQuestion(exhibitionId: number) {
  const questionId = generateId();
  return {
    id: questionId,
    text: "",
    imageUrl: null,
    answers: [
      {id: generateId(), text: "", isCorrect: false, questionId: questionId },
      {id: generateId(), text: "", isCorrect: false, questionId: questionId },
    ],
    quizId: exhibitionId,
  }
}

export default function QuizCreator() {
  const router = useRouter();
  const exhibitionId = useExhibitionIdFromParams();
  const createQuiz = useCreateQuiz();

  const [title, setTitle ] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([
    generateEmptyQuestion(exhibitionId),
  ]);

  

  const addQuestion = () => {
    const newQuestion: Question = generateEmptyQuestion(exhibitionId);
    setQuestions([...questions, newQuestion])
  }

  const updateQuestion = (updatedQuestion: Question) => {
    setQuestions(
      questions.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q))
    )
  }

  const deleteQuestion = (id: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== id))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (questions.every((q) => q.answers.some((a) => a.isCorrect))) {
      console.log("Quiz created:", questions)
      for (const question of questions) {
        if (!question.imageUrl) continue;
        question.imageUrl = await uploadImage(question.imageUrl);
      }
      createQuiz.mutate({
        title: title,
        exhibitionId: Number(exhibitionId),
        questions: questions.map((q) => ({
          text: q.text,
          imageUrl: q.imageUrl,
          answers: q.answers.map((a) => ({
            text: a.text,
            isCorrect: a.isCorrect,
          })),
        }))
      })
      router.push(`/dashboard/${exhibitionId}`)
    } else {
      alert("Please ensure each question has at least one correct answer.")
    }

  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>
            <Input
              id={`title-${title}`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter quiz title"
              required
            />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {questions.map((question) => (
                <QuestionCreator
                  key={question.id}
                  question={question}
                  onUpdate={updateQuestion}
                  onDelete={() => deleteQuestion(question.id!)}
                />
              ))}
            </div>
            <div className="flex justify-between mt-4">
              <Button type="button" onClick={addQuestion}>
                <Plus className="mr-2 h-4 w-4" />
                Add Question
              </Button>
              <Button type="submit">Create Quiz</Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}