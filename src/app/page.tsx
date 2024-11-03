"use client";

import { configurations } from "~/constants/config";
import PaginationControls from "../components/pagination-controls";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import MessageBanner from "./_components/message-banner";
import { useRouter } from "next/navigation";
import { ExhibitionList } from "./_components/exhibition-visitor-cards";
import type { Exhibition } from "./_types/exhibition";

interface MainPageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

const MainPage: React.FC<MainPageProps> = ({ searchParams }) => {
  const router = useRouter();
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  
  const currentPage = parseInt(searchParams.page as string) || 1;
  const exhibitionsPerPage = configurations.EXHIBITIONS_PER_PAGE;
  const totalPages = Math.ceil(exhibitions.length / exhibitionsPerPage);
  
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
  
  const indexOfLastExhibition = currentPage * exhibitionsPerPage;
  const indexOfFirstExhibition = indexOfLastExhibition - exhibitionsPerPage;
  const currentExhibitions = exhibitions.slice(indexOfFirstExhibition, indexOfLastExhibition);
  
  return (
    <div className="text-text-dark min-h-screen flex flex-col items-center justify-center py-12">
    <h1 className="text-4xl mb-28 text-accent">Explore Exhibitions</h1>
    
    <MessageBanner />
    
    {isLoading ? (
      <div>Loading...</div>
    ) : error ? (
      <div>Error loading exhibitions.</div>
    ) : currentExhibitions && currentExhibitions.length > 0 ? (
      <ExhibitionList exhibitions={currentExhibitions} onExhibitionClick={handleExhibitionClick} />
    ) : (
      <p className="text-gray-500">No exhibitions available.</p>
    )}
    <PaginationControls
    currentPage={currentPage}
    totalPages={totalPages}
    />
    </div>
  );
};

export default MainPage;