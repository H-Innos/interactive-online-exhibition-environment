"use client";

import { Suspense, useState, useCallback, useMemo } from "react";
import { api } from "~/trpc/react";
import { ArchiveCard } from "~/components/ExhibitionCard/cards";
import PageableExhibitions from "~/app/_components/pageable-cards";
import { useTranslation } from "react-i18next";
import FilterDropdown from "~/components/filter-dropdown";
import type { Exhibition as BaseExhibition } from "~/lib/types/entities";

type Exhibition = BaseExhibition & {
  categories?: Array<{ id: number; name: string }>;
};

const ArchivePage = () => {
  const { t } = useTranslation();
  const [filterOption, setFilterOption] = useState<string>("updatedDate");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const {
    data: archivedExhibitions,
    isLoading,
    error,
  } = api.exhibition.getArchived.useQuery();

  const { data: categories = [] } = api.category.getAll.useQuery();

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

  return (
    <Suspense fallback={<div>{t("mainPage.loading")}</div>}>
      <div className="relative min-h-screen px-4 text-text-dark sm:px-12">
        <div className="mt-12 flex items-center">
          <h1 className="text-dark mb-10 text-3xl font-bold">
            {t("archive.title")}
          </h1>
        </div>

        {isLoading ? (
          <div>{t("mainPage.loading")}</div>
        ) : error ? (
          <div>{t("mainPage.errorLoading")}</div>
        ) : (
          filteredAndSortedArchived && (
            <PageableExhibitions
              data-testid="archive-list"
              title=""
              exhibitions={filteredAndSortedArchived}
              CardComponent={(props) => <ArchiveCard {...props} />}
              FilterComponent={
                <FilterDropdown
                  filterOption={filterOption}
                  setFilterOption={handleFilterChange}
                  selectedCategories={selectedCategories}
                  setSelectedCategories={handleCategoryChange}
                  categories={categories.map(
                    (cat: { id: number | string; name: string }) => ({
                      id: cat.id.toString(),
                      name: cat.name,
                    }),
                  )}
                  exhibitions={archivedExhibitions}
                />
              }
            />
          )
        )}
      </div>
    </Suspense>
  );
};

export default ArchivePage;
