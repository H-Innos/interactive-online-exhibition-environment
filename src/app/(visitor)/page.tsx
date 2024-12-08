"use client";

import { useState, Suspense } from "react";
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

  const filteredAndSortedExhibitions = exhibitions
    ? exhibitions
        .filter(
          (exhibition: Exhibition) =>
            exhibition.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (selectedCategories.length === 0 ||
              exhibition.categories?.some((cat) =>
                selectedCategories.includes(cat.name),
              )),
        )
        .sort((a: Exhibition, b: Exhibition) => {
          switch (filterOption) {
            case "publishedDate":
              return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
              );
            case "alphabetical":
              return a.name.localeCompare(b.name);
            default:
              return 0;
          }
        })
    : [];

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
            ) : filteredAndSortedExhibitions.length > 0 ? (
              <PageableExhibitions
                title=""
                exhibitions={filteredAndSortedExhibitions}
                CardComponent={(props) => <VisitorCard {...props} />}
                FilterComponent={
                  <FilterDropdown
                    filterOption={filterOption}
                    setFilterOption={setFilterOption}
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}
                    categories={categories}
                  />
                }
              />
            ) : (
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
