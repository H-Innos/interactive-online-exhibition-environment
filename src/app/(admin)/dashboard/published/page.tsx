"use client";

import { api } from "~/trpc/react";
import { PublishedCard } from "~/components/ExhibitionCard/cards";
import PageableExhibitions from "~/app/_components/pageable-cards";
import { useTranslation } from "react-i18next";
import { Suspense } from "react";
import { useRouter } from "next/navigation";

const PublishedPage = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const {
    data: publishedExhibitions,
    error,
    isLoading,
  } = api.exhibition.getPublished.useQuery();

  return (
    <Suspense fallback={<div>{t("dashboard.loading")}</div>}>
      <div className="relative min-h-screen px-4 text-text-dark sm:px-12">
        <div className="mt-12 flex items-center">
          <h1 className="text-dark mb-10 text-3xl font-bold">
            {t("dashboard.published")}
          </h1>
        </div>

        {isLoading ? (
          <div>{t("dashboard.loading")}</div>
        ) : error ? (
          <div>{t("dashboard.errorLoading")}</div>
        ) : (
          publishedExhibitions && (
            <PageableExhibitions
              title=""
              exhibitions={publishedExhibitions}
              CardComponent={(props) => <PublishedCard {...props} />}
            />
          )
        )}
      </div>
    </Suspense>
  );
};

export default PublishedPage;
