"use client";

import React from "react";
import ExhibitionCard from "~/app/_components/exhibition-dashboard-cards";
import type { Exhibition } from "../../lib/types/exhibition";
import { useRouter } from "next/navigation";
import useResponsiveVisibleDrafts from "~/hooks/responsive-visible-drafts";

interface DraftExhibitionsProps {
  drafts: Exhibition[];
  onExhibitionClick: (id: number) => void;
}

const DraftExhibitions = ({ drafts, onExhibitionClick }: DraftExhibitionsProps) => {
  const router = useRouter();
  const maxVisibleItems = useResponsiveVisibleDrafts();
  const visibleDrafts = drafts.slice(0, maxVisibleItems);

  const handleViewAll = () => {
    router.push("/dashboard/drafts");
  };

  return (
    <div className="relative mb-10">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visibleDrafts.map((exhibition) => (
          <ExhibitionCard
            key={exhibition.id}
            exhibition={exhibition}
            onClick={() => onExhibitionClick(exhibition.id)}
          />
        ))}
      </div>

      {visibleDrafts.length === maxVisibleItems && (
        <div className="absolute top-0 right-[-50px] h-full w-1/4 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
      )}

      <div className="absolute top-1/2 right-0 transform -translate-y-1/2">
        <button
          onClick={handleViewAll}
          className="text-black flex items-center group"
          data-testid="view-all-button"
        >
          <span className="text-4xl text-black">〉</span>
        </button>
      </div>
    </div>
  );
};

export default DraftExhibitions;
