import { z } from "zod";
import { configurations } from "~/constants/config";

const thumbnailSchema = z
  .instanceof(File)
  .refine((file) => file.size <= configurations.FILE_MAX_SIZE, {
    message: `The file size exceeds the maximum allowed size of ${configurations.FILE_MAX_SIZE / (1024 * 1024)}MB.`,
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