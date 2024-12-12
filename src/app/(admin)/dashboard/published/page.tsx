"use client";

import { Suspense, useState, useCallback, useMemo } from "react";
import { api } from "~/trpc/react";
import { PublishedCard } from "~/components/ExhibitionCard/cards";
import PageableExhibitions from "~/app/_components/pageable-cards";
import { useTranslation } from "react-i18next";
import FilterDropdown from "~/components/filter-dropdown";
import type { Exhibition } from "~/lib/types/entities";

const PublishedPage = () => {
  const { t } = useTranslation();
  const [filterOption, setFilterOption] = useState<string>("updatedDate");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const {
    data: publishedExhibitions,
    error,
    isLoading,
  } = api.exhibition.getPublished.useQuery();

  const { data: categories = [] } = api.category.getAll.useQuery();

  const handleFilterChange = useCallback((option: string) => {
    setFilterOption(option);
  }, []);

  const handleCategoryChange = useCallback((categories: string[]) => {
    setSelectedCategories(categories);
  }, []);

  const filteredAndSortedPublished = useMemo(() => {
    if (!publishedExhibitions) return [];

    let filtered = publishedExhibitions;

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(
        (draft: Exhibition) =>
          draft.categories?.some((cat) =>
            selectedCategories.includes(cat.name),
          ) ?? false,
      );
    }

    return filtered.sort((a: Exhibition, b: Exhibition) => {
      switch (filterOption) {
        case t("updatedDate"):
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case t("alphabetical"):
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }, [publishedExhibitions, selectedCategories, filterOption, t]);

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
          filteredAndSortedPublished && (
            <PageableExhibitions
              data-testid="exhibition-list"
              title=""
              exhibitions={filteredAndSortedPublished}
              CardComponent={(props) => <PublishedCard {...props} />}
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
                  exhibitions={publishedExhibitions}
                />
              }
            />
          )
        )}
      </div>
    </Suspense>
  );
};

export default PublishedPage;
