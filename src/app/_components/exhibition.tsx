"use client";
import React from "react";

interface Exhibition {
  id: number;
  name: string | null;
  description: string | null;
  coverImageUrl: string | null;
  createdAt: Date | string;
  updatedAt: Date | null;
}
interface ExhibitionCardProps {
  exhibition: Exhibition;
  descriptionMaxLength: number;
  onClick: (id: number) => void;
  onDelete: (id: number) => void; 
}

const ExhibitionCard: React.FC<ExhibitionCardProps> = ({ exhibition, descriptionMaxLength, onClick, onDelete }) => {
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
      className="flex bg-background_dark rounded-lg overflow-hidden p-6 h-64 w-full md:w-[450px] cursor-pointer"
      onClick={() => onClick(exhibition.id)}
    >
      <div className="w-44 h-44 flex-shrink-0 bg-gray-200 rounded-md overflow-hidden flex items-center justify-center">
        <img
          src={exhibition.coverImageUrl ?? "/logos/museum.jpg"}
          alt={exhibition.name ?? "Exhibition"}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col justify-between pl-4 pr-8 w-2/3">
        <div>
          <h2 className="text-2xl font-semibold text-dark">{exhibition.name}</h2>
          <p className="text-lg text-text-dark overflow-wrap break-words whitespace-normal mt-2">
            {truncateDescription(exhibition.description ?? "", descriptionMaxLength)}
          </p>
        </div>
        <div className="flex justify-between items-center mt-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(exhibition.id);
            }}
            className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
          >
            Delete
          </button>
        </div>
        {/*<p className="text-base text-text-dark mt-2 self-end">Created: {formatDate(exhibition.createdAt)}</p>*/}
      </div>
    </div>
  );
};

export default ExhibitionCard;
