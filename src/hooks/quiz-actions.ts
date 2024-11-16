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

export const useDeleteQuiz = () => {
  const utils = api.useUtils();
  
  return api.quiz.delete.useMutation({
    onSuccess: async () => {
      await utils.quiz.invalidate();
      toast.success("Quiz deleted successfully!");
    },
    onError: (error) => {
      toast.error(`Failed to delete quiz: ${error.message}`);
    },
  });
}

