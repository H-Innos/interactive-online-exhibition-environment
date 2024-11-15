"use client";

import { useState, Suspense } from "react";
import { api } from "~/trpc/react";
import ArchiveClientComponent from "./ArchiveClientComponent";
import SearchBar from "~/app/_components/search-bar";
import { useTranslation } from "react-i18next";

export default function ArchivePage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const { data: archivedExhibitions, isLoading, error } = api.exhibition.getArchived.useQuery();

  const filteredExhibitions = archivedExhibitions?.filter((exhibition) =>
    exhibition.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) ?? [];

  return (
    <Suspense fallback={<div>{t('mainPage.loading')}</div>}>
      <div className="bg-white min-h-screen flex flex-col items-center py-8">
        <div className="w-full max-w-md mb-6">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>
        <div className="w-full px-2" style={{ maxWidth: "90%" }}>
          <h1 className="text-3xl mb-8 text-neutral text-center">{t('Archive')}</h1>
          
          {isLoading ? (
            <div>{t('mainPage.loading')}</div>
          ) : error ? (
            <div>{t('mainPage.errorLoading')}</div>
          ) : (
            <ArchiveClientComponent 
              exhibitions={filteredExhibitions}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </Suspense>
  );
}