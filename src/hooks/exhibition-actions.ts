"use client";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { invalidateExhibitionQueries } from "~/lib/utils/invalidate-queries";

export const useCreateExhibition = () => {
  const { t } = useTranslation();
  const utils = api.useUtils();
  return api.exhibition.create.useMutation({
    onSuccess: async () => {
      await invalidateExhibitionQueries(utils);
    },
    onError: (error: { message?: string }) => {
      toast.error(
        t("toasts.failedCreateExhibition", { message: error.message }),
      );
    },
  });
};

export const useUpdateExhibition = () => {
  const { t } = useTranslation();
  const utils = api.useUtils();

  return api.exhibition.update.useMutation({
    onSuccess: async () => {
      await invalidateExhibitionQueries(utils);
      toast.success(t("toasts.exhibitionUpdated"));
    },
    onError: (error: { message?: string }) => {
      toast.error(
        t("toasts.failedUpdateExhibition", { message: error.message }),
      );
    },
  });
};

export const usePublishExhibition = () => {
  const { t } = useTranslation();
  const utils = api.useUtils();
  const router = useRouter();

  return api.exhibition.publish.useMutation({
    onSuccess: async () => {
      await invalidateExhibitionQueries(utils);
      toast.success(t("toasts.exhibitionPublished"));
      router.push(`/dashboard`);
    },
    onError: (error) => {
      toast.error(
        t("toasts.failedPublishExhibition", { message: error.message }),
      );
    },
  });
};

export const useUnpublishExhibition = () => {
  const { t } = useTranslation();
  const utils = api.useUtils();

  return api.exhibition.unpublish.useMutation({
    onSuccess: async () => {
      await invalidateExhibitionQueries(utils);
      toast.success(t("toasts.exhibitionUnpublished"));
    },
    onError: (error) => {
      toast.error(
        t("toasts.failedUnpublishExhibition", { message: error.message }),
      );
    },
  });
};

export const useDeleteExhibition = (p0?: { onSuccess: () => void }) => {
  const { t } = useTranslation();
  const utils = api.useUtils();

  return api.exhibition.delete.useMutation({
    onSuccess: async () => {
      await invalidateExhibitionQueries(utils);
      toast.success(t("toasts.exhibitionDeleted"));
    },
    onError: (error) => {
      toast.error(
        t("toasts.failedDeleteExhibition", { message: error.message }),
      );
    },
  });
};

export const useArchiveExhibition = () => {
  const { t } = useTranslation();
  const utils = api.useUtils();

  return api.exhibition.archiveExhibition.useMutation({
    onSuccess: async () => {
      try {
        await invalidateExhibitionQueries(utils);
        toast.success(t("toasts.exhibitionArchived"));
      } catch (error) {
        console.error("Error invalidating queries:", error);
        toast.error(t("toasts.failedInvalidateCache"));
      }
    },
    onError: (error) => {
      toast.error(
        t("toasts.failedArchiveExhibition", { message: error.message }),
      );
    },
  });
};

export const useUnarchiveExhibition = () => {
  const { t } = useTranslation();
  const utils = api.useUtils();

  return api.exhibition.unarchiveExhibition.useMutation({
    onSuccess: async () => {
      try {
        await invalidateExhibitionQueries(utils);
        toast.success(t("toasts.exhibitionUnarchived"));
      } catch (error) {
        console.error("Error invalidating queries:", error);
        toast.error(t("toasts.failedInvalidateCache"));
      }
    },
    onError: (error) => {
      toast.error(
        t("toasts.failedUnarchiveExhibition", { message: error.message }),
      );
    },
  });
};

export const useTrashExhibition = () => {
  const { t } = useTranslation();
  const utils = api.useUtils();

  return api.exhibition.trash.useMutation({
    onSuccess: async () => {
      try {
        await invalidateExhibitionQueries(utils);
        await utils.exhibition.getTrashed.invalidate();
        toast.success(t("toasts.exhibitionTrashed"));
      } catch (error) {
        console.error("Error invalidating queries:", error);
        toast.error(t("toasts.failedInvalidateCache"));
      }
    },
    onError: (error) => {
      toast.error(
        t("toasts.failedDeleteExhibition", { message: error.message }),
      );
    },
  });
};

export const useRestoreExhibition = (p0?: { onSuccess: () => void }) => {
  const { t } = useTranslation();
  const utils = api.useUtils();

  return api.exhibition.restore.useMutation({
    onSuccess: async () => {
      try {
        await invalidateExhibitionQueries(utils);
        await utils.exhibition.getTrashed.invalidate();
        toast.success(t("toasts.exhibitionRestored"));
      } catch (error) {
        console.error("Error invalidating queries:", error);
        toast.error(t("toasts.failedInvalidateCache"));
      }
    },
    onError: (error) => {
      toast.error(
        t("toasts.failedRestoreExhibition", { message: error.message }),
      );
    },
  });
};
