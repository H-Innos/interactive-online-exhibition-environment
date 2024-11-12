"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "~/trpc/react";
import PageableExhibitions from "~/app/_components/pageable-cards";
import VisitorExhibitionCard from "~/app/_components/exhibition-visitor-cards";
import type { Exhibition } from "~/lib/types/exhibition";

interface MainPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

const MainPage: React.FC<MainPageProps> = ({  }) => {
  const router = useRouter();
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const { data, error, isLoading } = api.exhibition.getAll.useQuery();

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

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="bg-white min-h-screen flex flex-col justify-between items-center py-12">
        <div className="w-full px-2" style={{ maxWidth: "90%" }}>
          <h1 className="text-4xl mb-28 text-neutral text-center">Explore Exhibitions</h1>

          {isLoading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>Error loading exhibitions.</div>
          ) : exhibitions.length > 0 ? (
            <PageableExhibitions
              title=""
              exhibitions={exhibitions}
              onExhibitionClick={handleExhibitionClick}
              showFadeEffect={false}
              CardComponent={(props) => <VisitorExhibitionCard {...props} onClick={() => handleExhibitionClick(props.exhibition.id)} />}
            />
          ) : (
            <p className="text-gray-500 text-center">No exhibitions available.</p>
          )}
        </div>
      </div>
    </Suspense>
  );
};

export default MainPage;
