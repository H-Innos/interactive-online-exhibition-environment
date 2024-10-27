"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { ExhibitionCard, ExhibitionList } from "~/app/_components/exhibition-dashboard-cards";
import { configurations } from "~/constants/config";
import PaginationControls from "../../components/pagination-controls";
import CreateExhibitionModal from "../_components/create-exhibition-modal";
import MessageBanner from "../_components/message-banner";
import type { Exhibition } from "../_types/exhibition";

const ExhibitionsPage = ({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) => {
  const router = useRouter();
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [isCreateExhibitionModalOpen, setIsCreateExhibitionModalOpen] = useState(false);
  
  let currentPage = Number(searchParams.page);
  const totalPages = Math.ceil(exhibitions.length / configurations.EXHIBITIONS_PER_PAGE);
  
  if (isNaN(currentPage) || currentPage < 1 || currentPage > totalPages) {
    currentPage = 1;
  }
  const indexOfLastExhibition = currentPage * configurations.EXHIBITIONS_PER_PAGE;
  const indexOfFirstExhibition = indexOfLastExhibition - configurations.EXHIBITIONS_PER_PAGE;
  const currentExhibitions = exhibitions.slice(indexOfFirstExhibition, indexOfLastExhibition);
  
  const { data, error, isLoading } = api.exhibition.getAll.useQuery(undefined);
  const [sliceCount, setSliceCount] = useState(4);

  useEffect(() => {
    if (data) {
      setExhibitions(data);
    }
  }, [data]);

  useEffect(() => {
    const updateSliceCount = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth >= 1536) {
        setSliceCount(4); 
      } else if (screenWidth >= 1280) {
        setSliceCount(3); 
      } else if (screenWidth >= 1024) {
        setSliceCount(2); 
      } else {
        setSliceCount(1); 
      }
    };

    updateSliceCount();
    window.addEventListener("resize", updateSliceCount);
    
    return () => window.removeEventListener("resize", updateSliceCount);
  }, []);

  
  const handleExhibitionClick = (id: number) => {
    router.push(`/exhibitions/${id}`);
  };
  
  const handleViewAllDrafts = () => {
    router.push(`/exhibitions/drafts`);
  };
  
  return (
    <div className="text-text-dark min-h-screen pl-32 pr-12 py-8">
    <h1 className="text-3xl font-bold mb-2 text-accent">Dashboard</h1>
    <p className="text-lg mb-6 text-light-gray">Manage exhibitions</p>
    
    <MessageBanner />
    
    <button
    onClick={() => {
      setIsCreateExhibitionModalOpen(true);
    }}
    className="bg-primary-dark text-text-light px-4 py-2 rounded-md hover:bg-primary-dark_hover transition duration-300 mb-4"
    >
    New Exhibition
    </button>
    
    {isCreateExhibitionModalOpen && (
      <CreateExhibitionModal onClose={() => setIsCreateExhibitionModalOpen(false)} />
    )}
    
    {isLoading ? (
      <div>Loading...</div>
    ) : error ? (
      <div>Error loading exhibitions.</div>
    ) : currentExhibitions && currentExhibitions.length > 0 ? (
      <div>
      {currentPage === 1 && (
        <>
        <h1 className="text-2xl font-bold mb-2 text-accent">Drafts</h1>
        <div className="relative">
        <div className="grid grid-cols-1 l:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {currentExhibitions
          .filter((exhibition) => !exhibition.isPublished)
          .slice(0, sliceCount)
          .map((exhibition) => (
            <ExhibitionCard
            key={exhibition.id}
            exhibition={exhibition}
            onClick={handleExhibitionClick}
            />
          ))}
          </div>
          
          <div className="absolute top-0 right-0 w-50 h-full w-1/4 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
          <div className="absolute top-1/2 right-0 transform -translate-y-1/2">
          <button
          onClick={handleViewAllDrafts}
          className="text-black px-4 py-2 flex items-center relative group"
          >
          <span className="ml-2 text-4xl">〉</span>
          </button>
          </div>
          </div>
          </>
        )}
        
        <h1 className="text-2xl font-bold mb-2 mt-10 text-accent">Published Exhibitions</h1>
        <ExhibitionList
        exhibitions={currentExhibitions.filter((exhibition) => exhibition.isPublished)}
        onExhibitionClick={handleExhibitionClick}
        />
        </div>
      ) : (
        <p className="text-gray-500">No exhibitions available. Please add a new exhibition.</p>
      )}
      {totalPages > 1 && (
        <PaginationControls currentPage={currentPage} totalPages={totalPages} />
      )}
      </div>
    );
  };
  
  export default ExhibitionsPage;
  