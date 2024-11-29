"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { api } from "~/trpc/react";
import PageableExhibitions from "~/app/_components/pageable-cards";
import ExhibitionCard from "~/app/_components/exhibition-dashboard-cards";
import CreateExhibitionButton from "~/app/_components/create-exhibition-button";
import ShortenedDrafts from "~/app/_components/shortened-drafts";
import type { Exhibition } from "~/lib/types/entities";

const Dashboard = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [drafts, setDrafts] = useState<Exhibition[]>([]);
  const [recentExhibitions, setRecentExhibitions] = useState<Exhibition[]>([]);
  const {
    data: draftsData,
    error: draftsError,
    isLoading: isDraftsLoading,
  } = api.exhibition.getDrafts.useQuery();

  const {
    data: recentData,
    error: recentError,
    isLoading: isRecentLoading,
  } = api.exhibition.getRecent.useQuery({
    limit: 5,
  });

  useEffect(() => {
    if (draftsData) {
      setDrafts(draftsData);
    }
    if (recentData) {
      setRecentExhibitions(recentData);
    }
  }, [draftsData, recentData]);

  const handleExhibitionClick = (id: number) => {
    router.push(`/dashboard/${id}`);
  };

  return (
    <Suspense fallback={<div className="p-4">{t("dashboard.loading")}</div>}>
      <div className="min-h-screen max-w-full overflow-x-hidden p-8">
        <h1 className="mb-2 text-3xl font-bold">{t("dashboard.title")}</h1>
        <h2 className="mb-6 text-xl text-gray-500">
          {t("dashboard.manageExhibitions")}
        </h2>

        <CreateExhibitionButton />

        {isDraftsLoading ? (
          <div className="p-4">{t("dashboard.loadingDrafts")}</div>
        ) : draftsError ? (
          <div className="p-4 text-red-500">
            {t("dashboard.errorLoadingDrafts")}
          </div>
        ) : (
          <div>
            <h2 className="mb-5 text-2xl font-bold">{t("dashboard.drafts")}</h2>
            <ShortenedDrafts
              drafts={drafts}
              onExhibitionClick={(id) => handleExhibitionClick(id)}
            />
          </div>
        )}

        {isRecentLoading ? (
          <div className="p-4">{t("dashboard.loadingRecent")}</div>
        ) : recentError ? (
          <div className="p-4 text-red-500">
            {t("dashboard.errorLoadingRecent")}
          </div>
        ) : (
          <div>
            <h2 className="mb-5 text-2xl font-bold">
              {t("dashboard.recentExhibitions")}
            </h2>
            <PageableExhibitions
              title=""
              exhibitions={recentExhibitions}
              onExhibitionClick={handleExhibitionClick}
              showFadeEffect={false}
              CardComponent={(props) => (
                <ExhibitionCard
                  {...props}
                  onClick={() => handleExhibitionClick(props.exhibition.id)}
                />
              )}
            />
          </div>
        )}
      </div>
    </Suspense>
  );
};

export default Dashboard;
