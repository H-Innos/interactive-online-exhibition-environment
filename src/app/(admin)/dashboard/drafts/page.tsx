"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import PageableExhibitions from "~/app/_components/pageable-cards";
import ExhibitionCard from "~/app/_components/exhibition-dashboard-cards";
import CreateExhibitionButton from "~/app/_components/create-exhibition-button";
import type { Exhibition } from "../../../../lib/types/entities";
import { useTranslation } from "react-i18next";

const DraftsPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [drafts, setDrafts] = useState<Exhibition[]>([]);

  const { data, error, isLoading } = api.exhibition.getAll.useQuery();

  useEffect(() => {
    if (data) {
      setDrafts(
        data.filter(
          (exhibition) => !exhibition.isPublished && !exhibition.isArchived,
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
            {t("dashboard.drafts")}
          </h1>
        </div>

        <CreateExhibitionButton />

        {isLoading ? (
          <div>{t("dashboard.loading")}</div>
        ) : error ? (
          <div>{t("dashboard.errorLoading")}</div>
        ) : (
          <PageableExhibitions
            title=""
            exhibitions={drafts}
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

export default DraftsPage;
