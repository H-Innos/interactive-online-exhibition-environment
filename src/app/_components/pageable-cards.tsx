"use client";

import { useSearchParams } from "next/navigation";
import React from "react";
import PaginationControls from "~/components/pagination-controls";
import type { Exhibition } from "~/lib/types/exhibition";
import { configurations } from "~/lib/constants/config";

interface PageableExhibitionsProps {
  title: string;
  exhibitions: Exhibition[];
  onExhibitionClick: (id: number) => void;
  showFadeEffect?: boolean;
  CardComponent: React.FC<{ exhibition: Exhibition; onClick: () => void | ((id: number) => void) }>;
}

const PageableExhibitions = ({
  title,
  exhibitions,
  onExhibitionClick,
  showFadeEffect = false,
  CardComponent,
}: PageableExhibitionsProps) => {
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") ?? "1", 10);
  const exhibitionsPerPage = configurations.EXHIBITIONS_PER_PAGE;

  const indexOfLastExhibition = currentPage * exhibitionsPerPage;
  const indexOfFirstExhibition = indexOfLastExhibition - exhibitionsPerPage;
  const currentExhibitions = exhibitions.slice(indexOfFirstExhibition, indexOfLastExhibition);
  const totalPages = Math.ceil(exhibitions.length / exhibitionsPerPage);

  return (
    <div className="mb-10">
      <h1 className="text-2xl font-bold text-neutral mb-5">{title}</h1>

      <div className="relative">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {currentExhibitions.map((exhibition) => (
            <CardComponent
              key={exhibition.id}
              exhibition={exhibition}
              onClick={() => onExhibitionClick(exhibition.id)}
            />
          ))}
        </div>

        {showFadeEffect && currentExhibitions.length === exhibitionsPerPage && (
          <div className="absolute top-0 right-[-50px] h-full w-1/4 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
        )}
      </div>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </div>
  );
};

export default PageableExhibitions;
