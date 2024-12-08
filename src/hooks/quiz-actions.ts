import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import { type CreateQuizDTO } from "../lib/types/schemas";

export const useCreateQuiz = () => {
  const { t } = useTranslation();
  const utils = api.useUtils();

  return api.quiz.create.useMutation({
    onSuccess: async () => {
      await utils.quiz.invalidate();
      toast.success(t("toasts.quizCreated"));
    },
    onError: (error) => {
      toast.error(t("toasts.failedCreateQuiz", { message: error.message }));
    },
  });
};

export const useDeleteQuiz = () => {
  const utils = api.useUtils();

  return api.quiz.delete.useMutation({
    onSuccess: async () => {
      await utils.quiz.invalidate();
      toast.success(t("toasts.quizDeleted"));
    },
    onError: (error) => {
      toast.error(t("toasts.failedDeleteQuiz", { message: error.message }));
    },
  });
};

export const useEditQuiz = () => {
  const { t } = useTranslation();
  const utils = api.useUtils();

  const deleteQuiz = api.quiz.delete.useMutation();
  const createQuiz = api.quiz.create.useMutation();

  return {
    mutate: async (quizId: number, updatedQuiz: CreateQuizDTO) => {
      try {
        await deleteQuiz.mutateAsync({ quizId });
        await createQuiz.mutateAsync(updatedQuiz);
        await utils.quiz.invalidate();
        toast.success(t("toasts.quizEdited"));
      } catch (error) {
        if (error instanceof Error) {
          toast.error(t("toasts.failedEditQuiz", { message: error.message }));
        } else {
          toast.error(t("toasts.failedEditQuiz", { message: "Unknown error" }));
        }
      }
    },
  };
};
