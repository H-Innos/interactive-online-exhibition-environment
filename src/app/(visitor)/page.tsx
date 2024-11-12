"use client";

import { configurations } from "~/lib/constants/config";
import PaginationControls from "../../components/pagination-controls";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import ExhibitionList from "../_components/exhibition-list";
import VisitorExhibitionCard from "../_components/exhibition-visitor-cards";
import type { Exhibition } from "../../lib/types/exhibition";

interface MainPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

const MainPage: React.FC<MainPageProps> = ({ searchParams }) => {
  const router = useRouter();
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);

  const currentPage = parseInt(searchParams.page as string) || 1;
  const exhibitionsPerPage = configurations.EXHIBITIONS_PER_PAGE;

  const { data, error, isLoading } = api.exhibition.getAll.useQuery();

  useEffect(() => {
    if (data) {
      const publishedExhibitions = data.filter(
        (exhibition: Exhibition) => exhibition.isPublished
      );
      setExhibitions(publishedExhibitions);
    }
  }, [data]);

  const handleExhibitionClick = (id: number) => {
    router.push(`/${id}`);
  };

  const indexOfLastExhibition = currentPage * exhibitionsPerPage;
  const indexOfFirstExhibition = indexOfLastExhibition - exhibitionsPerPage;
  const currentExhibitions = exhibitions.slice(
    indexOfFirstExhibition,
    indexOfLastExhibition
  );

  const totalPages = Math.ceil(exhibitions.length / exhibitionsPerPage);

  return (
    <div className="bg-white min-h-screen flex flex-col justify-between items-center py-12">
    <div className="w-full px-2" style={{ maxWidth: "80%" }}>
    <h1 className="text-4xl mb-28 text-neutral text-center">Explore Exhibitions</h1>

        {isLoading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error loading exhibitions.</div>
        ) : currentExhibitions.length > 0 ? (
          <ExhibitionList
            exhibitions={currentExhibitions}
            onExhibitionClick={handleExhibitionClick}
            CardComponent={VisitorExhibitionCard}
          />
        ) : (
          <p className="text-gray-500 text-center">No exhibitions available.</p>
        )}
      </div>
      <PaginationControls currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
};

export default MainPage;
