import { type CreateQuizDTO } from "../types/schemas";

export function generateEmptyQuiz(exhibitionId: number): CreateQuizDTO {
  const id = generateId();
  return {
    id: id,
    title: "New Quiz",
    exhibitionId: exhibitionId,
    questions: [generateEmptyQuestion(id)]
  }
}

export function generateId() {
  return Date.now();
}

export function generateEmptyQuestion(quizId: number) {
  const questionId = generateId();
  return {
    id: questionId,
    text: "New Question",
    imageUrl: null,
    answers: [
    {id: generateId(), text: "Answer 1", isCorrect: true, questionId: questionId },
    {id: generateId(), text: "Answer 2", isCorrect: false, questionId: questionId },
    ],
    quizId: quizId,
  }
}