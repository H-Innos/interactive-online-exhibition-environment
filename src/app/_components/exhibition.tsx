"use client";
import React from "react";
import { FaCog } from "react-icons/fa"; 
import type { Exhibition } from "../_types/exhibition";
import Image from "next/image";

const ExhibitionCardConstants = {
  MAX_DESCRIPTION_LENGTH: 130,
  DEFAULT_COVER_IMAGE_URL: "/logos/museum.jpg",
  DEFAULT_IMAGE_ALT_TEXT: "Exhibition",
};

interface ExhibitionCardProps {
  exhibition: Exhibition;
  onClick: (id: number) => void;
  onOpenOptions: (id: number) => void;
}

interface ExhibitionListProps {
  exhibitions: Exhibition[];
  onExhibitionClick: (id: number) => void;
  onOpenOptions: (id: number) => void;
  onDelete: (id: number) => void;
}


const ExhibitionList: React.FC<ExhibitionListProps> = ({exhibitions, onExhibitionClick, onOpenOptions}: ExhibitionListProps) => {
  return (
    <div className="grid grid-cols-1 l:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-8">
      {exhibitions.map((exhibition) => (
        <ExhibitionCard
          key={exhibition.id}
          exhibition={exhibition}
          onClick={onExhibitionClick}
          onOpenOptions={() => onOpenOptions(exhibition.id)}
        />
      ))}
    </div>
  );
}

const ExhibitionCard: React.FC<ExhibitionCardProps> = ({ exhibition, onClick, onOpenOptions }) => {
  const truncateDescription = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleString("en-gb", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Etc/GMT-3",
    });
  };
  return (
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
            src={exhibition.coverImageUrl ?? ExhibitionCardConstants.DEFAULT_COVER_IMAGE_URL}
            alt={exhibition.name ?? ExhibitionCardConstants.DEFAULT_IMAGE_ALT_TEXT}
            layout="fill"  
            objectFit="cover" 
          />
        </div>
        <div className="flex flex-col justify-between pl-4 flex-grow overflow-hidden">
          <div>
            <h2 className="text-2xl font-semibold text-dark truncate">{exhibition.name}</h2>
            <p className="text-lg text-text-dark mt-2">
              {truncateDescription(exhibition.description ?? "", ExhibitionCardConstants.MAX_DESCRIPTION_LENGTH)}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onOpenOptions(exhibition.id);
        }}
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 z-10"
      >
        <FaCog size={20} />
      </button>
    </div>
  );
};

export { ExhibitionCardConstants, ExhibitionList, ExhibitionCard };
