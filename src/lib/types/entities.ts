export const exhibitionStatuses = ["draft", "published", "archived", "trashed"] as const;
export type ExhibitionStatus = (typeof exhibitionStatuses)[number];

export type Exhibition = {
  id: number;
  name: string;
  description: string | null;
  coverImageUrl: string | null;
  content: string | null;
  status: ExhibitionStatus;
  createdAt: Date | string;
  updatedAt: Date | null;
}

export type Answer = {
  id: number;
  questionId: number;
  text: string;
  isCorrect: boolean;
}

export type Question = {
  id: number;
  quizId: number;
  text: string;
  imageUrl: string | null;
  answers: Answer[];
}

export type Quiz = {
  id: number;
  exhibitionId: number;
  title: string;
  questions: Question[];
}