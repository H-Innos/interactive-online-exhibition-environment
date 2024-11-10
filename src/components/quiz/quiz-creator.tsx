"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { type Question, QuestionCreator } from "./question-creator"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { useCreateQuiz } from "~/hooks/quiz-actions"
import { uploadImage } from "~/lib/utils/image-uploader"

export default function QuizCreator() {
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      text: "",
      image: null,
      answers: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
    },
  ])

  const createQuiz = useCreateQuiz();

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      text: "",
      image: null,
      answers: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
    }
    setQuestions([...questions, newQuestion])
  }

  const updateQuestion = (updatedQuestion: Question) => {
    setQuestions(
      questions.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q))
    )
  }

  const deleteQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== id))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (questions.every((q) => q.answers.some((a) => a.isCorrect))) {
      console.log("Quiz created:", questions)
      for (const question of questions) {
        if (!question.image) continue;
        question.image = await uploadImage(question.image);
      }
      createQuiz.mutate({
        title: "New Quiz",
        questions: questions.map((q) => ({
          text: q.text,
          imageUrl: q.image,
          answers: q.answers.map((a) => ({
            text: a.text,
            isCorrect: a.isCorrect,
          })),
        }))
      })
    } else {
      alert("Please ensure each question has at least one correct answer.")
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Create a Quiz</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {questions.map((question) => (
                <QuestionCreator
                  key={question.id}
                  question={question}
                  onUpdate={updateQuestion}
                  onDelete={() => deleteQuestion(question.id)}
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
          </form>
        </CardContent>
      </Card>
    </div>
  )
}