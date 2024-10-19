"use client";
import React from "react";
import { FaCog } from "react-icons/fa"; 
import type { Exhibition } from "../_types/exhibition";

interface ExhibitionCardProps {
  exhibition: Exhibition;
  descriptionMaxLength: number;
  onClick: (id: number) => void;
  onOpenOptions: (id: number) => void;
  onDelete: (id: number) => void; 
}

const ExhibitionCard: React.FC<ExhibitionCardProps> = ({ exhibition, descriptionMaxLength, onClick, onOpenOptions ,onDelete }) => {
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
        <div className="w-44 h-44 flex-shrink-0 bg-gray-200 rounded-md overflow-hidden">
          <img
            src={exhibition.coverImageUrl ?? "/logos/museum.jpg"}
            alt={exhibition.name ?? "Exhibition"}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-between pl-4 flex-grow overflow-hidden">
          <div>
            <h2 className="text-2xl font-semibold text-dark truncate">{exhibition.name}</h2>
            <p className="text-lg text-text-dark mt-2 line-clamp-3">
              {truncateDescription(exhibition.description ?? "", descriptionMaxLength)}
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

export default ExhibitionCard;
