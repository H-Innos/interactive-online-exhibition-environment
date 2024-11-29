"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import PageableExhibitions from "~/app/_components/pageable-cards";
import ExhibitionCard from "~/app/_components/exhibition-dashboard-cards";
import type { Exhibition } from "../../../../lib/types/entities";
import { useTranslation } from "react-i18next";

const PublishedExhibitionsPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [publishedExhibitions, setPublishedExhibitions] = useState<
    Exhibition[]
  >([]);

  const { data, error, isLoading } = api.exhibition.getAll.useQuery();

  useEffect(() => {
    if (data) {
      setPublishedExhibitions(
        data.filter(
          (exhibition) => exhibition.isPublished && !exhibition.isArchived,
        ),
      );
    }
  }, [data]);

  const handleExhibitionClick = (id: number) => {
    router.push(`/dashboard/${id}`);
  };

  return (
    <Suspense fallback={<div>{t("dashboard.loading")}</div>}>
      <div className="relative min-h-screen px-4 text-text-dark sm:px-12">
        <div className="mt-12 flex items-center">
          <h1 className="text-dark mb-10 text-3xl font-bold">
            {t("dashboard.publishedExhibitions")}
          </h1>
        </div>

        {isLoading ? (
          <div>{t("dashboard.loading")}</div>
        ) : error ? (
          <div>{t("dashboard.errorLoading")}</div>
        ) : (
          <PageableExhibitions
            title=""
            exhibitions={publishedExhibitions}
            onExhibitionClick={handleExhibitionClick}
            showFadeEffect={false}
            CardComponent={(props) => (
              <ExhibitionCard
                {...props}
                onClick={() => handleExhibitionClick(props.exhibition.id)}
              />
            )}
          />
        )}
      </div>
    </Suspense>
  );
};

export default PublishedExhibitionsPage;
