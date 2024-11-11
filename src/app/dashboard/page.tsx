"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "~/trpc/react";
import type { Exhibition } from "../../lib/types/exhibition";
import ExhibitionSection from "../_components/exhibition-section";
import CreateExhibitionModal from "../_components/create-exhibition-modal";
import useResponsiveVisibleDrafts from "~/hooks/responsive-visible-drafts";

const ExhibitionPageContent = () => {
  const router = useRouter();
  const [drafts, setDrafts] = useState<Exhibition[]>([]);
  const [publishedExhibitions, setPublishedExhibitions] = useState<Exhibition[]>([]);
  const [isCreateExhibitionModalOpen, setIsCreateExhibitionModalOpen] = useState(false);
  const visibleDrafts = useResponsiveVisibleDrafts();

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

  const searchParams = useSearchParams();
  const currentPage = searchParams ? parseInt(searchParams.get("page") ?? "1", 10) : 1;

  return (
    <>
      <h1 className="text-3xl font-bold mb-2 text-neutral">Dashboard</h1>
      <h2 className="text-xl mb-6 text-gray-500">Manage Exhibitions</h2>

      <button
        onClick={() => setIsCreateExhibitionModalOpen(true)}
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
            <ExhibitionSection
              title="Drafts"
              exhibitions={drafts.slice(0, visibleDrafts)}
              onExhibitionClick={handleExhibitionClick}
              viewAllPath="/dashboard/drafts"
              maxVisibleItems={visibleDrafts}
              showFadeEffect
              onCreateExhibition={() => setIsCreateExhibitionModalOpen(true)}
              data-testid="drafts-section"
            />
          )}
          <ExhibitionSection
            title="Published Exhibitions"
            data-testid="published"
            exhibitions={publishedExhibitions}
            onExhibitionClick={handleExhibitionClick}
            showPagination
          />
        </>
      )}
    </>
  );
};

const ExhibitionsPage = () => (
  <Suspense fallback={<div>Loading search parameters...</div>}>
    <div className="text-text-dark min-h-screen px-4 sm:px-12 py-8">
      <ExhibitionPageContent />
    </div>
  </Suspense>
);

export default ExhibitionsPage;