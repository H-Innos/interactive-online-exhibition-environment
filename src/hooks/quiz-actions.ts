import { toast } from "sonner";
import { api } from "~/trpc/react";

export const useCreateQuiz = () => {
  const utils = api.useUtils();
  
  return api.quiz.create.useMutation({
    onSuccess: async () => {
      await utils.quiz.invalidate();
      toast.success("Quiz created successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to create quiz: ${error.message}`);
    },
  });
}