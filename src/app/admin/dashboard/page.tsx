"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "~/trpc/react";
import type { Exhibition } from "../../../lib/types/exhibition";
import DraftExhibitions from "../../_components/shortened-drafts";
import PublishedExhibitions from "../../_components/pageable-published";
import CreateExhibitionModal from "../../_components/create-exhibition-modal";
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
    router.push(`/admin/dashboard/${id}`);
  };

  const searchParams = useSearchParams();
  const currentPage = searchParams ? parseInt(searchParams.get("page") ?? "1", 10) : 1;

  return (
    <>
      <h1 className="text-3xl font-bold mb-2 text-neutral">Dashboard</h1>
      <h2 className="text-xl mb-6 text-gray-500">Manage Exhibitions</h2>

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
          <DraftExhibitions
            title="Drafts"
            drafts={drafts}
            onExhibitionClick={handleExhibitionClick}
            maxVisibleItems={visibleDrafts}
            showFadeEffect
            onCreateExhibition={() => setIsCreateExhibitionModalOpen(true)}
            viewAllPath="/admin/dashboard/drafts"
            data-testid="drafts-section"
          />
        )}
          <PublishedExhibitions
            title="Published Exhibitions"
            exhibitions={publishedExhibitions}
            onExhibitionClick={handleExhibitionClick}
            viewAllPath="/admin/dashboard/published"
            data-testid="published"
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