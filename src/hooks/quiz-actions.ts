import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { api } from "~/trpc/react";

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
