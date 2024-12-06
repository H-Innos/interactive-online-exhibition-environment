export type Exhibition = {
  id: number;
  name: string;
  description: string | null;
  thumbnailUrl: string | null;
  coverImagePositionX: number;
  coverImagePositionY: number;
  content: string | null;
  status: "draft" | "published" | "archived" | "trashed";
  createdAt: Date | string;
  updatedAt: Date | null;
  backgroundColor: string | null;
  exhibitionCoverUrl: string | null;
  categories?: { id: number; name: string }[];
};

export type Answer = {
  id: number;
  questionId: number;
  text: string;
  isCorrect: boolean;
};

export type Question = {
  id: number;
  quizId: number;
  text: string;
  imageUrl: string | null;
  answers: Answer[];
};

export type Quiz = {
  id: number;
  exhibitionId: number;
  title: string;
  questions: Question[];
};
