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
  const [publishedExhibitions, setPublishedExhibitions] = useState<
    Exhibition[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, error, isLoading } = api.exhibition.getAll.useQuery();

  useEffect(() => {
    if (data) {
      setDrafts(data.filter((exhibition) => !exhibition.isPublished));
      setPublishedExhibitions(
        data.filter((exhibition) => exhibition.isPublished),
      );
    }
  }, [data]);

  const handleExhibitionClick = (id: number, isPublished: boolean) => {
    if (!isPublished) {
      router.push(`/dashboard/${id}`);
    }
  };

  return (
    <Suspense fallback={<div>{t("dashboard.loading")}</div>}>
      <div className="min-h-screen max-w-full overflow-x-hidden px-4 py-8 text-text-dark sm:px-12">
        <h1 className="text-neutral mb-2 text-3xl font-bold">
          {t("dashboard.title")}
        </h1>
        <h2 className="mb-6 text-xl text-gray-500">
          {t("dashboard.manageExhibitions")}
        </h2>

        <CreateExhibitionButton />

        {isLoading ? (
          <div>{t("dashboard.loading")}</div>
        ) : error ? (
          <div>{t("dashboard.errorLoading")}</div>
        ) : (
          <>
            {currentPage === 1 && (
              <>
                <h1 className="text-neutral mb-5 text-2xl font-bold">
                  {t("dashboard.drafts")}
                </h1>
                <ShortenedDrafts
                  drafts={drafts}
                  onExhibitionClick={(id) => handleExhibitionClick(id, false)}
                />
              </>
            )}

            <PageableExhibitions
              title={t("dashboard.publishedExhibitions")}
              exhibitions={publishedExhibitions}
              onExhibitionClick={(id, isPublished) =>
                handleExhibitionClick(id, isPublished)
              }
              showFadeEffect={false}
              CardComponent={(props) => (
                <ExhibitionCard
                  {...props}
                  onClick={() =>
                    handleExhibitionClick(
                      props.exhibition.id,
                      props.exhibition.isPublished,
                    )
                  }
                />
              )}
            />
          </>
        )}
      </div>
    </Suspense>
  );
};

export default Dashboard;
