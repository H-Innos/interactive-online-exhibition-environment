"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import type { Exhibition } from "../../../../lib/types/exhibition";
import ExhibitionSection from "../../../_components/exhibition-section";
import CreateExhibitionModal from "../../../_components/create-exhibition-modal";

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
    router.push(`/admin/dashboard/${id}`);
  };

  const handleBackToDashboard = () => {
    router.push("/admin/dashboard");
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="text-text-dark min-h-screen px-4 sm:px-12 relative">
        <div className="flex items-center mt-12">
          <button
            onClick={handleBackToDashboard}
            className="text-4xl text-black rounded-md hover:text-gray-500 transition duration-300 mr-4 mb-10"
          >
            ❬
          </button>
          <h1 className="text-3xl font-bold text-dark mb-10">Drafts</h1>
        </div>
        {isCreateExhibitionModalOpen && (
          <CreateExhibitionModal onClose={() => setIsCreateExhibitionModalOpen(false)} />
        )}
        <ExhibitionSection
          title=""
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