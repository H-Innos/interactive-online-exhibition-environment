import { z } from "zod";
import { configurations } from "~/lib/constants/config";

const thumbnailSchema = z
  .instanceof(File)
  .refine((file) => file.size <= configurations.MAX_FILE_SIZE_BYTES, {
    message: `The file size exceeds the maximum allowed size of ${configurations.MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB.`,
  })
  .refine((file) => file.type.startsWith('image/'), {
    message: 'The file must be an image.',
  });

export const exhibitionFormSchema = z.object({
  title: z.string().min(1, { message: 'Title must not be empty.' }),
  description: z.string().max(configurations.MAX_DESCRIPTION_LENGTH, { message: `Description must not exceed ${configurations.MAX_DESCRIPTION_LENGTH} characters.` }),
  thumbnail: thumbnailSchema.optional(),
});
  
export type ExhibitionFormSchema = z.infer<typeof exhibitionFormSchema>; 

const answerSchema = z.object({
  id: z.number().optional(),
  text: z.string().min(1, { message: "Answer text can't be empty." }),
  isCorrect: z.boolean(),
});

export type Answer = z.infer<typeof answerSchema>;

const questionSchema = z.object({
  id: z.number().optional(),
  text: z.string().min(1, { message: "Question text is required." }),
  imageUrl: z.string().nullable(),
  answers: z.array(answerSchema).min(2, { message: "At least two answers are required." }),
});

export type Question = z.infer<typeof questionSchema>;

export const quizSchema = z.object({
  id: z
    .number()
    .optional(),
  title: z
    .string()
    .min(1, { message: "Quiz title is required." }),
  exhibitionId: z
    .number(),
  questions: z
    .array(questionSchema)
    .min(1, { message: "At least one question is required." }),
});

export type Quiz = z.infer<typeof quizSchema>;