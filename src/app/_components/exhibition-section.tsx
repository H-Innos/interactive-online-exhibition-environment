"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ExhibitionList } from "~/app/_components/exhibition-dashboard-cards";
import type { Exhibition } from "../_types/exhibition";
import PaginationControls from "../../components/pagination-controls";
import { configurations } from "~/lib/constants/config";

interface ExhibitionSectionProps {
  title: string;
  exhibitions: Exhibition[];
  onExhibitionClick: (id: number) => void;
  showPagination?: boolean;
  viewAllPath?: string;
  maxVisibleItems?: number;
  showFadeEffect?: boolean;
  onCreateExhibition?: () => void;
}

const ExhibitionSection = ({
  title,
  exhibitions,
  onExhibitionClick,
  showPagination = false,
  viewAllPath,
  maxVisibleItems,
  showFadeEffect = false,
  onCreateExhibition,
}: ExhibitionSectionProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const page = parseInt(searchParams?.get("page") ?? "1", 10);
    setCurrentPage(page);
  }, [searchParams]);

  const totalPages = Math.ceil(exhibitions.length / configurations.EXHIBITIONS_PER_PAGE);
  const indexOfLastExhibition = currentPage * configurations.EXHIBITIONS_PER_PAGE;
  const indexOfFirstExhibition = indexOfLastExhibition - configurations.EXHIBITIONS_PER_PAGE;
  const currentExhibitions = exhibitions.slice(indexOfFirstExhibition, indexOfLastExhibition);

  const handlePageChange = (newPage: number) => {
    router.push(`?page=${newPage}`);
  };

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
        <ExhibitionList exhibitions={currentExhibitions} onExhibitionClick={onExhibitionClick}/>
        {showFadeEffect && currentExhibitions.length === maxVisibleItems && (
          <div className="absolute top-0 right-0 h-full w-1/4 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
        )}
        {viewAllPath && (
          <div className="absolute top-1/2 right-8 transform -translate-y-1/2">
            <button onClick={handleViewAll} className="text-black px-4 py-2 flex items-center group" data-testid="view-all-button">
              <span className="ml-2 text-4xl">〉</span>
            </button>
          </div>
        )}
      </div>
      {showPagination && (
        <PaginationControls currentPage={currentPage} totalPages={totalPages} />
      )}
    </div>
  );
};

export default ExhibitionSection;
