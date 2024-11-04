"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "~/trpc/react";
import type { Exhibition } from "../_types/exhibition";
import ExhibitionSection from "../_components/exhibition-section";
import CreateExhibitionModal from "../_components/create-exhibition-modal";
import MessageBanner from "../_components/message-banner";

const ExhibitionPageContent = () => {
  const router = useRouter();
  const [drafts, setDrafts] = useState<Exhibition[]>([]);
  const [publishedExhibitions, setPublishedExhibitions] = useState<Exhibition[]>([]);
  const [isCreateExhibitionModalOpen, setIsCreateExhibitionModalOpen] = useState(false);
  const [visibleDrafts, setVisibleDrafts] = useState(getInitialVisibleDrafts());

  const { data, error, isLoading } = api.exhibition.getAll.useQuery();

  useEffect(() => {
    if (data) {
      setDrafts(data.filter((exhibition) => !exhibition.isPublished));
      setPublishedExhibitions(data.filter((exhibition) => exhibition.isPublished));
    }
  }, [data]);

  useEffect(() => {
    const updateVisibleDrafts = () => {
      if (window.innerWidth < 768) {
        setVisibleDrafts(1);
      } else if (window.innerWidth < 1200) {
        setVisibleDrafts(2);
      } else if (window.innerWidth < 1536) {
        setVisibleDrafts(3);
      } else {
        setVisibleDrafts(4);
      }
    };

    window.addEventListener("resize", updateVisibleDrafts);
    updateVisibleDrafts();

    return () => window.removeEventListener("resize", updateVisibleDrafts);
  }, []);

  function getInitialVisibleDrafts() {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 768) return 1;
      if (window.innerWidth < 1200) return 2;
      if (window.innerWidth < 1536) return 3;
      return 4;
    }
    return 4;
  }

  const handleExhibitionClick = (id: number) => {
    router.push(`/dashboard/${id}`);
  };

  const searchParams = useSearchParams();
  const currentPage = searchParams ? parseInt(searchParams.get("page") ?? "1", 10) : 1;

  return (
    <>
      <h1 className="text-3xl font-bold mb-2 text-accent">Dashboard</h1>
      <h2 className="text-xl mb-6 text-gray-500">Manage Exhibitions</h2>

      <MessageBanner />

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
    <div className="text-text-dark min-h-screen pl-32 pr-12 py-8">
      <ExhibitionPageContent />
    </div>
  </Suspense>
);

export default ExhibitionsPage;
