"use client";

import { useSearchParams } from "next/navigation";
import React from "react";
import PaginationControls from "~/components/pagination-controls";
import type { Exhibition } from "~/lib/types/entities";
import { configurations } from "~/lib/constants/config";

interface PageableExhibitionsProps {
  title: string;
  exhibitions: Exhibition[];
  onExhibitionClick: (id: number, isPublished: boolean) => void;
  showFadeEffect?: boolean;
  CardComponent: React.FC<{ exhibition: Exhibition; onClick: () => void }>;
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
  const currentExhibitions = exhibitions.slice(
    indexOfFirstExhibition,
    indexOfLastExhibition,
  );
  const totalPages = Math.ceil(exhibitions.length / exhibitionsPerPage);

  return (
    <div className="mb-10">
      <h1 className="text-neutral mb-5 text-2xl font-bold">{title}</h1>

      <div className="relative">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {currentExhibitions.map((exhibition) => (
            <CardComponent
              key={exhibition.id}
              exhibition={exhibition}
              onClick={() =>
                onExhibitionClick(exhibition.id, exhibition.isPublished)
              }
            />
          ))}
        </div>

        {showFadeEffect && currentExhibitions.length === exhibitionsPerPage && (
          <div className="pointer-events-none absolute right-[-50px] top-0 h-full w-1/4 bg-gradient-to-l from-white to-transparent"></div>
        )}
      </div>

      <PaginationControls currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
};

export default PageableExhibitions;
