"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "~/trpc/react";
import type { Exhibition } from "../_types/exhibition";
import ExhibitionSection from "../_components/exhibition-section";
import CreateExhibitionModal from "../_components/create-exhibition-modal";
import MessageBanner from "../_components/message-banner";

const ExhibitionsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [drafts, setDrafts] = useState<Exhibition[]>([]);
  const [publishedExhibitions, setPublishedExhibitions] = useState<Exhibition[]>([]);
  const [isCreateExhibitionModalOpen, setIsCreateExhibitionModalOpen] = useState(false);

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

  const currentPage = parseInt(searchParams.get("page") ?? "1", 10);

  return (
    <div className="text-text-dark min-h-screen pl-32 pr-12 py-8">
      <h1 className="text-3xl font-bold mb-2 text-accent">Dashboard</h1>
      <h2 className="text-xl mb-6 text-gray-500">Manage Exhibitions</h2>

      <MessageBanner />

      {isCreateExhibitionModalOpen && <CreateExhibitionModal onClose={() => setIsCreateExhibitionModalOpen(false)} />}

      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error loading exhibitions.</div>
      ) : (
        <>
          {currentPage === 1 && drafts.length > 0 && (
            <ExhibitionSection
              title="Drafts"
              exhibitions={drafts.slice(0, 4)}
              onExhibitionClick={handleExhibitionClick}
              viewAllPath="/dashboard/drafts"
              maxVisibleItems={4}
              showFadeEffect
              onCreateExhibition={() => setIsCreateExhibitionModalOpen(true)}
            />
          )}
          <ExhibitionSection
            title="Published Exhibitions"
            exhibitions={publishedExhibitions}
            onExhibitionClick={handleExhibitionClick}
            showPagination
          />
        </>
      )}
    </div>
  );
};

export default ExhibitionsPage;