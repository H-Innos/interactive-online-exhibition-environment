"use client";

import { useState, Suspense } from "react";
import { api } from "~/trpc/react";
import SearchBar from "~/app/_components/search-bar";
import { useTranslation } from "react-i18next";
import PageableExhibitions from "~/app/_components/pageable-cards";
import { ArchiveCard } from "~/components/ExhibitionCard/cards";

export default function ArchivePage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const {
    data: archivedExhibitions,
    isLoading,
    error,
  } = api.exhibition.getArchived.useQuery();

  const filteredExhibitions =
    archivedExhibitions?.filter((exhibition) =>
      exhibition.name?.toLowerCase().includes(searchTerm.toLowerCase()),
    ) ?? [];

  return (
    <Suspense fallback={<div>{t("mainPage.loading")}</div>}>
      <div className="flex min-h-screen flex-col items-center bg-white py-8">
        <div className="mb-6 flex w-full justify-center px-4 sm:justify-end">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>
        <div className="w-full px-2" style={{ maxWidth: "90%" }}>
          <h1 className="text-neutral mb-8 text-center text-3xl">
            {t("archive.title")}
          </h1>

          {isLoading ? (
            <div>{t("mainPage.loading")}</div>
          ) : error ? (
            <div>{t("mainPage.errorLoading")}</div>
          ) : filteredExhibitions.length > 0 ? (
            <PageableExhibitions
              title={t("archive.title")}
              exhibitions={filteredExhibitions}
              CardComponent={(props) => <ArchiveCard {...props} />}
            />
          ) : (
            <div className="mt-8 text-center text-gray-500">
              <p className="text-xl">No matching exhibitions found.</p>
            </div>
          )}
        </div>
      </div>
    </Suspense>
  );
}
