"use client";

import { useState, Suspense, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { api } from "~/trpc/react";
import PageableExhibitions from "~/app/_components/pageable-cards";
import CreateExhibitionButton from "~/app/_components/create-exhibition-button";
import ShortenedDrafts from "~/app/_components/shortened-drafts";
import { PublishedCard } from "~/components/ExhibitionCard/cards";
import FilterDropdown from "~/components/filter-dropdown";

const Dashboard = () => {
  const { t } = useTranslation();
  const [currentPage] = useState(1);
  const [filterOption, setFilterOption] = useState<string>("updatedDate");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const {
    data: publishedExhibitions,
    error: errorPublished,
    isLoading: publishedLoading,
  } = api.exhibition.getPublished.useQuery();

  const { data: categories = [] } = api.category.getAll.useQuery();

  const handleFilterChange = useCallback((option: string) => {
    setFilterOption(option);
  }, []);

  const handleCategoryChange = useCallback((categories: string[]) => {
    setSelectedCategories(categories);
  }, []);

  const filteredAndSortedExhibitions = useMemo(() => {
    if (!publishedExhibitions) return [];

    const filtered = publishedExhibitions.filter((exhibition) => {
      const categoryMatch =
        selectedCategories.length === 0 ||
        exhibition.categories?.some((cat) =>
          selectedCategories.includes(cat.name),
        );
      return categoryMatch;
    });

    return filtered.sort((a, b) => {
      switch (filterOption) {
        case "updatedDate":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "alphabetical":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }, [publishedExhibitions, selectedCategories, filterOption]);

  const filterComponent = (
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
      exhibitions={publishedExhibitions ?? []}
    />
  );

  return (
    <Suspense fallback={<div className="p-4">{t("dashboard.loading")}</div>}>
      <div className="min-h-screen max-w-full overflow-x-hidden px-0 sm:px-8">
        <h1 className="mb-2 mt-8 text-2xl font-bold sm:text-3xl">
          {t("dashboard.title")}
        </h1>
        <h2 className="mb-6 text-lg text-gray-500 sm:text-xl">
          {t("dashboard.manageExhibitions")}
        </h2>

        <CreateExhibitionButton />

        {currentPage === 1 && (
          <>
            <h1 className="text-neutral mb-5 text-xl font-bold sm:text-2xl">
              {t("dashboard.drafts")}
            </h1>
            <ShortenedDrafts />
          </>
        )}

        {publishedLoading ? (
          <div>{t("dashboard.loading")}</div>
        ) : errorPublished ? (
          <div>{t("dashboard.errorLoading")}</div>
        ) : (
          <>
            {filteredAndSortedExhibitions.length > 0 ? (
              <PageableExhibitions
                title={t("dashboard.publishedExhibitions")}
                exhibitions={filteredAndSortedExhibitions}
                CardComponent={(props) => <PublishedCard {...props} />}
                FilterComponent={filterComponent}
              />
            ) : (
              <p>{t("dashboard.noExhibitions")}</p>
            )}
          </>
        )}
      </div>
    </Suspense>
  );
};

export default Dashboard;
