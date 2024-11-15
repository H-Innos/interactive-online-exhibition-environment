"use client";
import React from "react";
import Image from "next/image";
import type { Exhibition } from "../../lib/types/exhibition";
import { configurations } from "~/lib/constants/config";


interface VisitorExhibitionCardProps {
  exhibition: Exhibition;
  onClick: (id: number) => void;
}

const VisitorExhibitionCard: React.FC<VisitorExhibitionCardProps> = ({
  exhibition,
  onClick,
}) => {
  const truncateDescription = (text: string, maxLength: number) =>
    text.length <= maxLength ? text : `${text.slice(0, maxLength)}...`;

  return (
    <div
      className="flex flex-col bg-white border border-gray overflow-hidden cursor-pointer"
      onClick={() => onClick(exhibition.id)}
      data-testid="exhibition-card"
    >
      <div className="relative h-52 bg-gray-200 overflow-hidden">
        <Image
          src={exhibition.coverImageUrl ?? configurations.DEFAULT_COVER_IMAGE_URL}
          alt={exhibition.name}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="p-4">
        <h2 className="text-2xl font-medium text-dark line-clamp-2">
          {exhibition.name}
        </h2>
        <p className="text-base text-gray-500 mt-2">
        {truncateDescription(exhibition.description ?? "", configurations.MAX_DESCRIPTION_LENGTH)}</p>
      </div>
    </div>
  );
};

export default VisitorExhibitionCard;
