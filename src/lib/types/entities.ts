export type Exhibition = {
  id: number;
  name: string;
  description: string | null;
  status: ExhibitionStatus;
  createdAt: Date;
  updatedAt: Date | null;
  thumbnailUrl: string | null;
  exhibitionCoverUrl: string | null;
  coverImagePositionX: number;
  coverImagePositionY: number;
  content: string | null;
  backgroundColor: string | null;
  categories: Category[];
  contributors: Contributor[];
};

export type ExhibitionStatus = "draft" | "published" | "archived" | "trashed";

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

export type Category = {
  id: number;
  name: string;
};

export type Contributor = {
  role: string;
  names: string;
};
