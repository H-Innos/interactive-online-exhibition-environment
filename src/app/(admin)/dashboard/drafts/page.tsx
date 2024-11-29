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
          <button
            onClick={() => router.push("/dashboard")}
            className="mb-10 mr-4 rounded-md text-4xl text-black transition duration-300 hover:text-gray-500"
          >
            ❬
          </button>
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
              title={t("dashboard.allDrafts")}
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
