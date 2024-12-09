"use client";

import { Suspense, useEffect, useState, useCallback, useMemo } from "react";
import { api } from "~/trpc/react";
import PageableExhibitions from "~/app/_components/pageable-cards";
import CreateExhibitionButton from "~/app/_components/create-exhibition-button";
import { useTranslation } from "react-i18next";
import { DraftCard } from "~/components/ExhibitionCard/cards";
import FilterDropdown from "~/components/filter-dropdown";
import { Exhibition } from "~/lib/types/entities";

const DraftsPage = () => {
  const { t } = useTranslation();
  const [filterOption, setFilterOption] = useState<string>("updatedDate");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const {
    data: exhibitions,
    error,
    isLoading,
  } = api.exhibition.getAll.useQuery();

  const drafts = exhibitions?.filter((ex) => ex.status === "draft") ?? [];

  const { data: categories = [] } = api.category.getAll.useQuery();

  useEffect(() => {
    if (error) {
      console.error("Error fetching drafts:", error);
    }
  }, [error]);

  const handleFilterChange = useCallback((option: string) => {
    setFilterOption(option);
  }, []);

  const handleCategoryChange = useCallback((categories: string[]) => {
    setSelectedCategories(categories);
  }, []);

  const filteredAndSortedDrafts = useMemo(() => {
    if (!drafts) return [];

    let filtered = drafts;

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(
        (draft) =>
          draft.categories?.some((cat: { id: number; name: string }) =>
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
  }, [drafts, selectedCategories, filterOption]);

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
          filteredAndSortedDrafts && (
            <PageableExhibitions
              data-testid="exhibition-list"
              title=""
              exhibitions={filteredAndSortedDrafts}
              CardComponent={(props) => <DraftCard {...props} />}
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
                  exhibitions={drafts}
                />
              }
            />
          )
        )}
      </div>
    </Suspense>
  );
};

export default DraftsPage;
