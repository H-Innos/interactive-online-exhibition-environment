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

  const deleteExhibition = useDeleteExhibition();

  const handlePermanentDelete = async (id: number) => {
    const confirmed = window.confirm(t("trash.confirmPermanentDelete"));
    if (confirmed) {
      try {
        await deleteExhibition.mutateAsync({ id });
        await refetch();
      } catch (error) {
        console.error("Failed to delete exhibition:", error);
      }
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
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
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
                    onClick={async () => {
                      try {
                        await restoreExhibition.mutateAsync({
                          id: exhibition.id,
                        });
                      } catch (error) {
                        console.error("Failed to restore exhibition:", error);
                      }
                    }}
                    className="flex items-center gap-2"
                  >
                    <ArrowPathIcon className="h-5 w-5" />
                    {t("trash.restore")}
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={async () => handlePermanentDelete(exhibition.id)}
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
