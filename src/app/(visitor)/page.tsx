"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import PageableExhibitions from "~/app/_components/pageable-cards";
import VisitorExhibitionCard from "~/app/_components/exhibition-visitor-cards";
import type { Exhibition } from "~/lib/types/exhibition";
import { useTranslation } from 'react-i18next';
import SearchBar from "~/app/_components/search-bar";

interface MainPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

const MainPage: React.FC<MainPageProps> = ({}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const { data, error, isLoading } = api.exhibition.getAll.useQuery();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (data) {
      const publishedExhibitions = data.filter(
        (exhibition: Exhibition) => exhibition.isPublished
      );
      setExhibitions(publishedExhibitions);
    }
  }, [data]);

  const handleExhibitionClick = (id: number) => {
    router.push(`/${id}`);
  };

  const filteredExhibitions = exhibitions.filter(exhibition =>
    exhibition.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Suspense fallback={<div>{t('mainPage.loading')}</div>}>
      <div className="bg-white min-h-screen flex flex-col items-center py-8">
        <div className="w-full max-w-md mb-6">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>
        <div className="w-full px-2" style={{ maxWidth: "90%" }}>
        <h1 className="text-3xl mb-8 text-neutral text-center">{t('mainPage.exploreExhibitions')}</h1>

        {isLoading ? (
            <div>{t('mainPage.loading')}</div>
          ) : error ? (
            <div>{t('mainPage.errorLoading')}</div>
          ) : filteredExhibitions.length > 0 ? (
            <PageableExhibitions
              title=""
              exhibitions={filteredExhibitions}
              onExhibitionClick={handleExhibitionClick}
              showFadeEffect={false}
              CardComponent={(props) => <VisitorExhibitionCard {...props} onClick={() => handleExhibitionClick(props.exhibition.id)} />}
            />
          ) : (
            <p className="text-gray-500 text-center">{t('mainPage.noExhibitions')}</p>
          )}
        </div>
      </div>
    </Suspense>
  );
};

export default MainPage;