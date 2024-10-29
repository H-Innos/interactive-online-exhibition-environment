"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { ExhibitionList } from "~/app/_components/exhibition-dashboard-cards";
import { configurations } from "~/constants/config";
import PaginationControls from "../../components/pagination-controls";
import CreateExhibitionModal from "../_components/create-exhibition-modal";
import MessageBanner from "../_components/message-banner";
import type { Exhibition } from "../_types/exhibition";

const ExhibitionsPage = ({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) => {
  const router = useRouter();
  const [drafts, setDrafts] = useState<Exhibition[]>([]);
  const [publishedExhibitions, setPublishedExhibitions] = useState<Exhibition[]>([]);
  const [isCreateExhibitionModalOpen, setIsCreateExhibitionModalOpen] = useState(false);

  let currentPage = Number(searchParams.page);
  const totalPages = Math.ceil(publishedExhibitions.length / configurations.EXHIBITIONS_PER_PAGE);

  if (isNaN(currentPage) || currentPage < 1 || currentPage > totalPages) {
    currentPage = 1;
  }

  const indexOfLastPublishedExhibition = currentPage * configurations.EXHIBITIONS_PER_PAGE;
  const indexOfFirstPublishedExhibition = indexOfLastPublishedExhibition - configurations.EXHIBITIONS_PER_PAGE;
  const currentPublishedExhibitions = publishedExhibitions.slice(indexOfFirstPublishedExhibition, indexOfLastPublishedExhibition);

  const { data, error, isLoading } = api.exhibition.getAll.useQuery(undefined);

  useEffect(() => {
    if (data) {
      setDrafts(data.filter((exhibition) => !exhibition.isPublished).slice(0, 4));
      setPublishedExhibitions(data.filter((exhibition) => exhibition.isPublished));
    }
  }, [data]);

  const handleExhibitionClick = (id: number) => {
    router.push(`/exhibitions/${id}`);
  };

  const handleViewAllDrafts = () => {
    router.push(`/exhibitions/drafts`);
  };

  const handlePageChange = (page: number) => {
    router.push(`/exhibitions?page=${page}`);
  };

  return (
    <div className="text-text-dark min-h-screen pl-32 pr-12 py-8">
      <h1 className="text-3xl font-bold mb-2 text-accent">Dashboard</h1>
      <p className="text-lg mb-6 text-light-gray">Manage exhibitions</p>

      <MessageBanner />

      <button
        onClick={() => {
          setIsCreateExhibitionModalOpen(true);
        }}
        className="bg-primary-dark text-text-light px-4 py-2 rounded-md hover:bg-primary-dark_hover transition duration-300 mb-4"
      >
        New Exhibition
      </button>

      {isCreateExhibitionModalOpen && (
        <CreateExhibitionModal onClose={() => setIsCreateExhibitionModalOpen(false)} />
      )}

      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error loading exhibitions.</div>
      ) : (
        <>
          {currentPage === 1 && drafts.length > 0 && (
            <>
              <h1 className="text-2xl font-bold mb-2 text-accent">Drafts</h1>
              <div className="relative">
                <ExhibitionList
                  exhibitions={drafts}
                  onExhibitionClick={handleExhibitionClick}
                  section="Drafts"
                />

                <div className="absolute top-0 right-0 h-full w-1/4 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>

                <div className="absolute top-1/2 right-8 transform -translate-y-1/2">
                  <button
                    onClick={handleViewAllDrafts}
                    className="text-black px-4 py-2 flex items-center relative group"
                  >
                    <span className="ml-2 text-4xl">〉</span>
                  </button>
                </div>
              </div>
            </>
          )}

          <h1 className="text-2xl font-bold mb-2 mt-10 text-accent">Published Exhibitions</h1>
          <ExhibitionList
            exhibitions={currentPublishedExhibitions}
            onExhibitionClick={handleExhibitionClick}
            section="Published"
          />

          {totalPages > 1 && (
            <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          )}
        </>
      )}
    </div>
  );
};

export default ExhibitionsPage;