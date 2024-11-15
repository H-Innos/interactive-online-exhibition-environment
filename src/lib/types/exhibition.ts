export type Exhibition = {
    id: number;
    name: string;
    description: string | null;
    coverImageUrl: string | null;
    content: string | null;
    isPublished: boolean;
    isArchived: boolean;
    createdAt: Date | string;
    updatedAt: Date | null;
  }