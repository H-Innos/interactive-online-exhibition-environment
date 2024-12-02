"use client";

import { useState, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { api } from "~/trpc/react";
import PageableExhibitions from "~/app/_components/pageable-cards";
import CreateExhibitionButton from "~/app/_components/create-exhibition-button";
import ShortenedDrafts from "~/app/_components/shortened-drafts";
import { PublishedCard } from "~/components/ExhibitionCard/cards";

const Dashboard = () => {
  const { t } = useTranslation();
  const [currentPage] = useState(1);

  const {
    data: publishedExhibitions,
    error: errorPublished,
    isLoading: publishedLoading,
  } = api.exhibition.getPublished.useQuery();

  return (
    <Suspense fallback={<div className="p-4">{t("dashboard.loading")}</div>}>
      <div className="min-h-screen max-w-full overflow-x-hidden p-8">
        <h1 className="mb-2 text-3xl font-bold">{t("dashboard.title")}</h1>
        <h2 className="mb-6 text-xl text-gray-500">
          {t("dashboard.manageExhibitions")}
        </h2>

        <CreateExhibitionButton />

        {currentPage === 1 && (
          <>
            <h1 className="text-neutral mb-5 text-2xl font-bold">
              {t("dashboard.drafts")}
            </h1>
            <ShortenedDrafts />
          </>
        )}

        {publishedLoading ? (
          <div>{t("dashboard.loading")}</div>
        ) : errorPublished ? (
          <div>{t("dashboard.errorLoading")}</div>
        ) : (
          <>
            {publishedExhibitions && (
              <PageableExhibitions
                title={t("dashboard.publishedExhibitions")}
                exhibitions={publishedExhibitions}
                CardComponent={(props) => <PublishedCard {...props} />}
              />
            )}
          </>
        )}
      </div>
    </Suspense>
  );
};

export default Dashboard;
