"use client";

import { useState, Suspense, useCallback, useMemo } from "react";
import { api } from "~/trpc/react";
import PageableExhibitions from "~/app/_components/pageable-cards";
import { useTranslation } from "react-i18next";
import SearchBar from "~/app/_components/search-bar";
import { VisitorCard } from "~/components/ExhibitionCard/cards";
import FilterDropdown from "~/components/filter-dropdown";
import { Exhibition } from "~/lib/types/entities";
import NavBar from "~/components/navbar";

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
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [filterOption, setFilterOption] = useState<string>("publishedDate");

  const { data: categories = [] } = api.category.getAll.useQuery();

  const handleFilterChange = useCallback((option: string) => {
    setFilterOption(option);
  }, []);

  const handleCategoryChange = useCallback((categories: string[]) => {
    console.log("Categories changed:", categories);
    setSelectedCategories(categories);
  }, []);

  const filteredAndSortedExhibitions = useMemo(() => {
    if (!exhibitions) return [];

    console.log("Filtering exhibitions:", {
      totalExhibitions: exhibitions.length,
      searchTerm,
      selectedCategories,
    });

    const filtered = exhibitions.filter((exhibition: Exhibition) => {
      const nameMatch = exhibition.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const categoryMatch =
        selectedCategories.length === 0 ||
        (exhibition.categories &&
          exhibition.categories.some((cat) =>
            selectedCategories.includes(cat.name),
          ));

      console.log("Exhibition:", {
        name: exhibition.name,
        categories: exhibition.categories,
        nameMatch,
        categoryMatch,
      });

      return nameMatch && (selectedCategories.length === 0 || categoryMatch);
    });

    console.log("Filtered exhibitions:", filtered.length);

    return filtered.sort((a: Exhibition, b: Exhibition) => {
      switch (filterOption) {
        case "publishedDate":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "alphabetical":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }, [exhibitions, searchTerm, selectedCategories, filterOption]);

  return (
    <>
      <NavBar />
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
            ) : (
              <>
                {console.log(
                  "Rendering exhibitions:",
                  filteredAndSortedExhibitions.length,
                )}

                <PageableExhibitions
                  title=""
                  exhibitions={filteredAndSortedExhibitions}
                  CardComponent={(props) => <VisitorCard {...props} />}
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
                      exhibitions={exhibitions}
                    />
                  }
                />
              </>
            )}
            {filteredAndSortedExhibitions.length === 0 && (
              <p className="text-center text-gray-500">
                {t("mainPage.noExhibitions")}
              </p>
            )}
          </div>
        </div>
      </Suspense>
    </>
  );
};

export default MainPage;
