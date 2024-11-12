"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ExhibitionList from "../_components/exhibition-list";
import type { Exhibition } from "../../lib/types/exhibition";
import PaginationControls from "../../components/pagination-controls";
import { configurations } from "~/lib/constants/config";
import ExhibitionCard from "~/app/_components/exhibition-dashboard-cards";

interface PublishedExhibitionsProps {
  title: string;
  exhibitions: Exhibition[];
  onExhibitionClick: (id: number) => void;
  viewAllPath?: string;
}

const PublishedExhibitions = ({
  title,
  exhibitions,
  onExhibitionClick,
}: PublishedExhibitionsProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(parseInt(searchParams?.get("page") ?? "1", 10));
  }, [searchParams]);

  const totalPages = Math.ceil(exhibitions.length / configurations.EXHIBITIONS_PER_PAGE);
  const indexOfLastExhibition = currentPage * configurations.EXHIBITIONS_PER_PAGE;
  const indexOfFirstExhibition = indexOfLastExhibition - configurations.EXHIBITIONS_PER_PAGE;
  const currentExhibitions = exhibitions.slice(indexOfFirstExhibition, indexOfLastExhibition);

  return (
    <div className="mb-10">
      <h1 className="text-2xl font-bold text-neutral">{title}</h1>

      <div className="relative">
        <ExhibitionList
          exhibitions={currentExhibitions}
          onExhibitionClick={onExhibitionClick}
          CardComponent={({ exhibition, onClick }) => (
            <ExhibitionCard exhibition={exhibition} onClick={onClick} showOptions={true} />
          )}
        />
      </div>
      <PaginationControls currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
};

export default PublishedExhibitions;
