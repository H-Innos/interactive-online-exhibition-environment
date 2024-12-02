"use client";

import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { TrashIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import {
  useRestoreExhibition,
  useDeleteExhibition,
} from "~/hooks/exhibition-actions";

const TrashedExhibitionsPage = () => {
  const { t } = useTranslation();

  const {
    data: trashedExhibitions,
    error,
    refetch,
  } = api.exhibition.getTrashed.useQuery();

  const restoreExhibition = useRestoreExhibition();
  const deleteExhibition = useDeleteExhibition({
    onSuccess: () => {
      refetch();
    },
  });

  const handlePermanentDelete = (id: number) => {
    const confirmed = window.confirm(t("trash.confirmPermanentDelete"));
    if (confirmed) {
      deleteExhibition.mutate({ id });
    }
  };

  return (
    <Suspense fallback={<div className="p-4">{t("trash.loading")}</div>}>
      <div className="min-h-screen max-w-full overflow-x-hidden p-8">
        <h1 className="mb-2 text-3xl font-bold">{t("trash.title")}</h1>
        <h2 className="mb-6 text-xl text-gray-500">
          {t("trash.manageTrashedExhibitions")}
        </h2>

        {error ? (
          <div>{t("trash.errorLoading")}</div>
        ) : trashedExhibitions && trashedExhibitions.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {trashedExhibitions.map((exhibition) => (
              <div
                key={exhibition.id}
                className="rounded-lg border bg-white p-4 shadow-md"
              >
                <h3 className="text-lg font-bold">{exhibition.name}</h3>
                <p className="text-sm text-gray-600">
                  {exhibition.description ?? t("trash.noDescription")}
                </p>

                <div className="mt-4 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() =>
                      restoreExhibition.mutate({ id: exhibition.id })
                    }
                    className="flex items-center gap-2"
                  >
                    <ArrowPathIcon className="h-5 w-5" />
                    {t("trash.restore")}
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={() => handlePermanentDelete(exhibition.id)}
                    className="flex items-center gap-2"
                  >
                    <TrashIcon className="h-5 w-5" />
                    {t("trash.permanentDelete")}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>{t("trash.noTrashedExhibitions")}</div>
        )}
      </div>
    </Suspense>
  );
};

export default TrashedExhibitionsPage;
