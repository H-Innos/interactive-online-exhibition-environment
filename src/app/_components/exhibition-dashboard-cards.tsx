"use client";
import React, { useState } from "react";
import { FaCog } from "react-icons/fa"; 
import type { Exhibition } from "../_types/exhibition";
import Image from "next/image";
import { configurations } from "~/constants/config";
import DashboardActionsModal from "./dashboard-actions-modal";

interface ExhibitionCardProps {
  exhibition: Exhibition;
  onClick: (id: number) => void;
}

interface ExhibitionListProps {
  exhibitions: Exhibition[];
  onExhibitionClick: (id: number) => void;
}

const ExhibitionList: React.FC<ExhibitionListProps> = ({ exhibitions, onExhibitionClick }: ExhibitionListProps) => {
  return (
    <div className="grid grid-cols-1 l:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-8">
    {exhibitions.map((exhibition) => (
      <ExhibitionCard
      key={exhibition.id}
      exhibition={exhibition}
      onClick={onExhibitionClick}
      />
    ))}
    </div>
  );
}

const ExhibitionCard: React.FC<ExhibitionCardProps> = ({ exhibition, onClick }) => {
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  
  const handleCogClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const modalWidth = 300;
    const viewportWidth = window.innerWidth;

    let leftPosition = rect.left + window.scrollX;
    if (leftPosition + modalWidth > viewportWidth) {
      leftPosition = viewportWidth - modalWidth;
    }
    setModalPosition({ 
      top: rect.bottom + window.scrollY, 
      left: leftPosition
    });
    setIsOptionsModalOpen(true);
  };

  
  const truncateDescription = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };
  
  return (
    <div>
    <div
    key={exhibition.id}
    className="flex bg-background_dark rounded-lg overflow-hidden p-6 h-64 w-full md:w-[450px] cursor-pointer relative"
    >
    <div 
    className="flex w-full"
    onClick={() => onClick(exhibition.id)}
    >
    <div className="w-44 h-44 flex-shrink-0 bg-gray-200 rounded-md overflow-hidden relative">
    <Image
    src={exhibition.coverImageUrl ?? configurations.DEFAULT_COVER_IMAGE_URL}
    alt={exhibition.name ?? "Exhibition"}
    layout="fill"  
    objectFit="cover" 
    />
    </div>
    <div className="flex flex-col justify-between pl-4 flex-grow overflow-hidden">
    <div>
    <h2 className="text-2xl font-semibold text-dark truncate">{exhibition.name}</h2>
    <p className="text-lg text-text-dark mt-2">
    {truncateDescription(exhibition.description ?? "", configurations.MAX_DESCRIPTION_LENGTH)}
    </p>
    </div>
    </div>
    </div>
    
    <button
    onClick={handleCogClick}
    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 z-10"
    >
    <FaCog size={20} />
    </button>
    </div>
    
    {isOptionsModalOpen && (
      <DashboardActionsModal
      exhibition={exhibition}
      onClose={() => setIsOptionsModalOpen(false)}
      position={modalPosition}
      />
    )}
    </div>
  );
};

export { ExhibitionList, ExhibitionCard };

