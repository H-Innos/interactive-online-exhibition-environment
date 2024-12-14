"use client";

import { useState, Suspense, useCallback, useMemo } from "react";
import { api } from "~/trpc/react";
import SearchBar from "~/app/_components/search-bar";
import { useTranslation } from "react-i18next";
import PageableExhibitions from "~/app/_components/pageable-cards";
import { ArchiveCard } from "~/components/ExhibitionCard/cards";
import FilterDropdown from "~/components/filter-dropdown";
import type { Exhibition as BaseExhibition } from "~/lib/types/entities";

type Exhibition = BaseExhibition & {
  categories?: Array<{ id: number; name: string }>;
};

export default function ArchivePage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOption, setFilterOption] = useState<string>("updatedDate");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const {
    data: archivedExhibitions,
    isLoading,
    error,
  } = api.exhibition.getArchived.useQuery();

  const { data: categories } = api.category.getAll.useQuery();
  const safeCategories = categories ?? [];

  const handleFilterChange = useCallback((option: string) => {
    setFilterOption(option);
  }, []);

  const handleCategoryChange = useCallback((categories: string[]) => {
    setSelectedCategories(categories);
  }, []);

  const filteredAndSortedArchived = useMemo(() => {
    if (!archivedExhibitions) return [];

    let filtered = archivedExhibitions;

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(
        (exhibition: Exhibition) =>
          exhibition.categories?.some((cat) =>
            selectedCategories.includes(cat.name),
          ) ?? false,
      );
    }

    return filtered.sort((a: Exhibition, b: Exhibition) => {
      switch (filterOption) {
        case "updatedDate":
          return (
            new Date(b.updatedAt ?? b.createdAt).getTime() -
            new Date(a.updatedAt ?? a.createdAt).getTime()
          );
        case "alphabetical":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }, [archivedExhibitions, selectedCategories, filterOption]);

  const filterComponent = (
    <FilterDropdown
      filterOption={filterOption}
      setFilterOption={handleFilterChange}
      selectedCategories={selectedCategories}
      setSelectedCategories={handleCategoryChange}
      categories={safeCategories.map((cat) => ({
        id: cat.id.toString(),
        name: cat.name,
      }))}
      exhibitions={archivedExhibitions ?? []}
    />
  );

  return (
    <Suspense fallback={<div>{t("mainPage.loading")}</div>}>
      <div className="flex min-h-screen w-screen flex-col items-center overflow-x-hidden bg-white py-8">
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
          ) : (
            <>
              <PageableExhibitions
                data-testid="exhibition-list"
                title={t("archive.title")}
                exhibitions={filteredAndSortedArchived}
                CardComponent={(props) => <ArchiveCard {...props} />}
                FilterComponent={filterComponent}
              />
              {filteredAndSortedArchived.length === 0 && (
                <div className="mt-8 text-center text-gray-500">
                  <p className="text-xl">No matching exhibitions found.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Suspense>
  );
}
