"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import PageableExhibitions from "~/app/_components/pageable-cards";
import ExhibitionCard from "~/app/_components/exhibition-dashboard-cards";
import CreateExhibitionButton from "~/app/_components/create-exhibition-button";
import ShortenedDrafts from "~/app/_components/shortened-drafts";
import type { Exhibition } from "~/lib/types/exhibition";

const Dashboard = () => {
  const router = useRouter();
  const [drafts, setDrafts] = useState<Exhibition[]>([]);
  const [publishedExhibitions, setPublishedExhibitions] = useState<Exhibition[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, error, isLoading } = api.exhibition.getAll.useQuery();

  useEffect(() => {
    if (data) {
      setDrafts(data.filter((exhibition) => !exhibition.isPublished));
      setPublishedExhibitions(data.filter((exhibition) => exhibition.isPublished));
    }
  }, [data]);

  const handleExhibitionClick = (id: number) => {
    router.push(`/dashboard/${id}`);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="text-text-dark min-h-screen px-4 sm:px-12 py-8">
        <h1 className="text-3xl font-bold mb-2 text-neutral">Dashboard</h1>
        <h2 className="text-xl mb-6 text-gray-500">Manage Exhibitions</h2>

        <CreateExhibitionButton />

        {isLoading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error loading exhibitions.</div>
        ) : (
          <>
            {currentPage === 1 && (
              <>
                <h1 className="text-2xl font-bold text-neutral mb-5">Drafts</h1>
                <ShortenedDrafts drafts={drafts} onExhibitionClick={handleExhibitionClick} />
              </>
            )}

            <PageableExhibitions
              title="Published Exhibitions"
              exhibitions={publishedExhibitions}
              onExhibitionClick={handleExhibitionClick}
              showFadeEffect={false}
              CardComponent={(props) => (
                <ExhibitionCard {...props} onClick={() => handleExhibitionClick(props.exhibition.id)} />
              )}
            />
          </>
        )}
      </div>
    </Suspense>
  );
};

export default Dashboard;
