"use client";
import React from "react";
import type { Exhibition } from "../../lib/types/exhibition";
import Image from "next/image";
import { configurations } from "~/lib/constants/config";

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
    <div className="grid grid-cols-1 l:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-20">
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
  const truncateDescription = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  return (
    <div
      key={exhibition.id}
      className="flex flex-col bg-white border border-gray overflow-hidden h-auto w-full md:w-[450px] cursor-pointer"
      onClick={() => onClick(exhibition.id)}
    >
      <div className="w-full h-52 bg-gray-200 overflow-hidden relative">
        <Image
          src={exhibition.coverImageUrl ?? configurations.DEFAULT_COVER_IMAGE_URL}
          alt={exhibition.name ?? "Exhibition"}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="flex flex-col mt-2 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-medium text-dark overflow-hidden line-clamp-2">
            {exhibition.name}
          </h2>
          <button
            className="bg-black text-white text-sm w-20 h-8 flex items-center justify-center rounded-full mb-3 ml-5 hover:bg-gray-600"
            onClick={(e) => {
              e.stopPropagation();
              onClick(exhibition.id);
            }}
          >
            View
          </button>
        </div>
        <p className="text-base text-gray-500 mt-2">
          {truncateDescription(exhibition.description ?? "", configurations.MAX_DESCRIPTION_LENGTH)}
        </p>
      </div>
    </div>
  );
};



export { ExhibitionList, ExhibitionCard };