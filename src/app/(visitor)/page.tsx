"use client";

import { useState, Suspense } from "react";
import { api } from "~/trpc/react";
import PageableExhibitions from "~/app/_components/pageable-cards";
import { useTranslation } from "react-i18next";
import SearchBar from "~/app/_components/search-bar";
import { VisitorCard } from "~/components/ExhibitionCard/cards";

interface MainPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

const MainPage: React.FC<MainPageProps> = ({}) => {
  const { t } = useTranslation();
  const {
    data: exhibitions,
    error,
    isLoading,
  } = api.exhibition.getPublished.useQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const filteredExhibitions = exhibitions
    ? exhibitions.filter((exhibition) =>
        exhibition.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : [];

  return (
    <Suspense fallback={<div>{t("mainPage.loading")}</div>}>
      <div className="flex min-h-screen flex-col items-center bg-white py-8">
        <div className="mb-6 flex w-full justify-center px-4 sm:justify-end">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>
        <div className="w-full px-2" style={{ maxWidth: "90%" }}>
          <h1 className="text-neutral mb-8 text-center text-3xl">
            {t("mainPage.exploreExhibitions")}
          </h1>

          {isLoading ? (
            <div>{t("mainPage.loading")}</div>
          ) : error ? (
            <div>{t("mainPage.errorLoading")}</div>
          ) : filteredExhibitions.length > 0 ? (
            <PageableExhibitions
              title=""
              exhibitions={filteredExhibitions}
              CardComponent={(props) => <VisitorCard {...props} />}
            />
          ) : (
            <p className="text-center text-gray-500">
              {t("mainPage.noExhibitions")}
            </p>
          )}
        </div>
      </div>
    </Suspense>
  );
};

export default MainPage;
