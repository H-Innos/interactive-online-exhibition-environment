"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ExhibitionList } from "./_components/exhibition-visitor-cards";
import { api } from "~/trpc/react";
import { configurations } from "~/constants/config";
import MessageBanner from "./_components/message-banner";
import PaginationControls from "../components/pagination-controls";
import SearchBar from "./_components/search-bar";
import type { Exhibition } from "./_types/exhibition";

interface MainPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

const MainPage: React.FC<MainPageProps> = ({ searchParams }) => {
  const router = useRouter();
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  const currentPage = parseInt(searchParams.page as string) || 1;
  const exhibitionsPerPage = configurations.EXHIBITIONS_PER_PAGE;
  const { data, error, isLoading } = api.exhibition.getAll.useQuery();
  
  useEffect(() => {
    if (data) {
      const publishedExhibitions = data.filter((exhibition: Exhibition) => exhibition.isPublished);
      setExhibitions(publishedExhibitions);
    }
  }, [data]);
  
  const handleExhibitionClick = (id: number) => {
    router.push(`/exhibitions/view/${id}`);
  };

  const filteredExhibitions = exhibitions.filter(exhibition =>
    exhibition.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredExhibitions.length / exhibitionsPerPage);
  const indexOfLastExhibition = currentPage * exhibitionsPerPage;
  const indexOfFirstExhibition = indexOfLastExhibition - exhibitionsPerPage;
  const currentExhibitions = filteredExhibitions.slice(indexOfFirstExhibition, indexOfLastExhibition);

  return (
    <div className="text-text-dark min-h-screen flex flex-col items-center justify-start py-12 px-4">
      <div className="w-full max-w-md mb-8">
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
      </div>

      <h1 className="text-4xl mb-8 text-accent">Explore Exhibitions</h1>
      
      <MessageBanner />
      
      <div className="w-full max-w-7xl mt-8">
        {isLoading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error loading exhibitions.</div>
        ) : currentExhibitions && currentExhibitions.length > 0 ? (
          <ExhibitionList exhibitions={currentExhibitions} onExhibitionClick={handleExhibitionClick} />
        ) : (
          <p className="text-gray-500">No exhibitions available.</p>
        )}
      </div>

      <div className="mt-8 flex justify-center">
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
};

export default MainPage;