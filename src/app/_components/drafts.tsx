"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { ExhibitionList } from "~/app/_components/exhibition-dashboard-cards";
import { configurations } from "~/constants/config";
import PaginationControls from "../../components/pagination-controls";
import type { Exhibition } from "../_types/exhibition";

const DraftsPage = () => {
  const router = useRouter();
  const [drafts, setDrafts] = useState<Exhibition[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(drafts.length / configurations.EXHIBITIONS_PER_PAGE);
  const indexOfLastDraft = currentPage * configurations.EXHIBITIONS_PER_PAGE;
  const indexOfFirstDraft = indexOfLastDraft - configurations.EXHIBITIONS_PER_PAGE;
  const currentDrafts = drafts.slice(indexOfFirstDraft, indexOfLastDraft);

  const { data, error, isLoading } = api.exhibition.getAll.useQuery(undefined);

  useEffect(() => {
    if (data) {
      setDrafts(data.filter((exhibition) => !exhibition.isPublished));
    }
  }, [data]);

  const handleExhibitionClick = (id: number) => {
    router.push(`/exhibitions/${id}`);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleBackToDashboard = () => {
    router.push("/exhibitions");
  };

  return (
    <div className="text-text-dark min-h-screen pl-32 pr-12 py-8">
      <button
        onClick={handleBackToDashboard}
        className="mb-4 text-5xl px-4 py-2 text-black rounded-md hover:text-gray-500 transition duration-300"
      >
        ❬
      </button>

      <h1 className="text-3xl font-bold mb-2 text-accent">Drafts</h1>
      <p className="text-lg mb-6 text-light-gray">Manage all drafts</p>

      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error loading drafts.</div>
      ) : currentDrafts && currentDrafts.length > 0 ? (
        <div>
          <ExhibitionList
            exhibitions={currentDrafts}
            onExhibitionClick={handleExhibitionClick}
            section="Drafts"
          />
           <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
            />
        </div>
      ) : (
        <p className="text-gray-500">No draft exhibitions available.</p>
      )}
    </div>
  );
};

export default DraftsPage;
