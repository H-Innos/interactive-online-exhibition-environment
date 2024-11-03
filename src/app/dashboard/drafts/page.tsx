"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import type { Exhibition } from "../../_types/exhibition";
import ExhibitionSection from "../../_components/exhibition-section";
import CreateExhibitionModal from "../../_components/create-exhibition-modal";

const DraftsPage = () => {
  const router = useRouter();
  const [drafts, setDrafts] = useState<Exhibition[]>([]);
  const [isCreateExhibitionModalOpen, setIsCreateExhibitionModalOpen] = useState(false);

  const { data } = api.exhibition.getAll.useQuery();

  useEffect(() => {
    if (data) {
      setDrafts(data.filter((exhibition) => !exhibition.isPublished));
    }
  }, [data]);

  const handleExhibitionClick = (id: number) => {
    router.push(`/dashboard/${id}`);
  };

  const handleBackToDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="text-text-dark min-h-screen pl-32 pr-12 relative">
        <button
          onClick={handleBackToDashboard}
          className="absolute text-4xl text-black rounded-md hover:text-gray-500 transition duration-300"
          style={{ top: '-100px', left: '16px' }}
        >
          ❬
        </button>
        <h1 className="text-3xl font-bold mb-4 text-accent mt-12">Drafts</h1>
        {isCreateExhibitionModalOpen && (
          <CreateExhibitionModal onClose={() => setIsCreateExhibitionModalOpen(false)} />
        )}
        <ExhibitionSection
          title="Drafts"
          exhibitions={drafts}
          onExhibitionClick={handleExhibitionClick}
          showPagination
          onCreateExhibition={() => setIsCreateExhibitionModalOpen(true)}
        />
      </div>
    </Suspense>
  );
};

export default DraftsPage;
