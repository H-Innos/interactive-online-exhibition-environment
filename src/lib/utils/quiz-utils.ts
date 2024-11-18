import { type CreateQuizDTO } from "../types/schemas";

export function generateEmptyQuiz(exhibitionId: number): CreateQuizDTO {
  const id = generateId();
  return {
    id: id,
    title: "",
    exhibitionId: exhibitionId,
    questions: [generateEmptyQuestion(id)],
  };
}

export function generateId() {
  return Date.now();
}

export function generateEmptyQuestion(quizId: number) {
  const questionId = generateId();
  return {
    id: questionId,
    text: "",
    imageUrl: null,
    answers: [
      { id: generateId(), text: "", isCorrect: false, questionId: questionId },
      { id: generateId(), text: "", isCorrect: false, questionId: questionId },
    ],
    quizId: quizId,
  };
}
