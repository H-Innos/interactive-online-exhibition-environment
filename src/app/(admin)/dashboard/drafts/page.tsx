"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import PageableExhibitions from "~/app/_components/pageable-cards";
import CreateExhibitionButton from "~/app/_components/create-exhibition-button";
import { useTranslation } from "react-i18next";
import { DraftCard } from "~/components/ExhibitionCard/cards";

const DraftsPage = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const {
    data: drafts,
    error,
    isLoading,
  } = api.exhibition.getDrafts.useQuery();

  return (
    <Suspense fallback={<div>{t("dashboard.loading")}</div>}>
      <div className="relative min-h-screen px-4 text-text-dark sm:px-12">
        <div className="mt-12 flex items-center">
          <h1 className="text-dark mb-10 text-3xl font-bold">
            {t("dashboard.drafts")}
          </h1>
        </div>

        <CreateExhibitionButton />

        {isLoading ? (
          <div>{t("dashboard.loading")}</div>
        ) : error ? (
          <div>{t("dashboard.errorLoading")}</div>
        ) : (
          drafts && (
            <PageableExhibitions
              title=""
              exhibitions={drafts}
              CardComponent={(props) => <DraftCard {...props} />}
            />
          )
        )}
      </div>
    </Suspense>
  );
};

export default DraftsPage;
