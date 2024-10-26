export interface Exhibition {
    id: number;
    name: string;
    description: string | null;
    coverImageUrl: string | null;
    content: string | null;
    isPublished: boolean;
    createdAt: Date | string;
    updatedAt: Date | null;
  }