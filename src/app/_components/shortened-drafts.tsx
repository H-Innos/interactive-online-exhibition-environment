"use client";

import { ExhibitionList } from "~/app/_components/exhibition-dashboard-cards";
import type { Exhibition } from "../../lib/types/exhibition";
import { useRouter } from "next/navigation";

interface DraftExhibitionsProps {
  title: string;
  drafts: Exhibition[];
  onExhibitionClick: (id: number) => void;
  maxVisibleItems: number;
  showFadeEffect?: boolean;
  onCreateExhibition?: () => void;
  viewAllPath?: string;
}

const DraftExhibitions = ({
  title,
  drafts,
  onExhibitionClick,
  maxVisibleItems,
  showFadeEffect = false, 
  onCreateExhibition,
  viewAllPath,
}: DraftExhibitionsProps) => {
  const router = useRouter();
  const visibleDrafts = drafts.slice(0, maxVisibleItems);

  const handleViewAll = () => {
    if (viewAllPath) {
      router.push(viewAllPath);
    }
  };

  return (
    <div className="mb-10">
      {onCreateExhibition && (
        <button
          onClick={onCreateExhibition}
          className="bg-primary-dark text-text-light px-4 py-2 rounded-md hover:bg-primary-dark_hover transition duration-300 mb-4"
        >
          New Exhibition
        </button>
      )}
      <h1 className="text-2xl font-bold text-neutral">{title}</h1>

      <div className="relative">
        <ExhibitionList exhibitions={visibleDrafts} onExhibitionClick={onExhibitionClick} />
        
        {showFadeEffect && visibleDrafts.length === maxVisibleItems && (
          <div className="absolute top-0 right-[-50px] h-full w-1/4 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
        )}

        {viewAllPath && (
          <div className="absolute top-1/2 right-0 transform -translate-y-1/2">
            <button onClick={handleViewAll} className="text-black flex items-center group" data-testid="view-all-button">
              <span className="text-4xl text-black">〉</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DraftExhibitions;
