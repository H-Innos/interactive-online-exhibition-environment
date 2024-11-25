"use client";
import React from "react";
import Image from "next/image";
import type { Exhibition } from "../../lib/types/entities";
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
      className="border-gray flex cursor-pointer flex-col overflow-hidden border bg-white"
      onClick={() => onClick(exhibition.id)}
      data-testid="exhibition-card"
    >
      <div className="relative h-52 overflow-hidden bg-gray-200">
        <Image
          src={
            exhibition.coverImageUrl ?? configurations.DEFAULT_COVER_IMAGE_URL
          }
          alt={exhibition.name}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="p-4">
        <h2 className="text-dark line-clamp-2 text-2xl font-medium">
          {exhibition.name}
        </h2>
        <p className="mt-2 text-base text-gray-500">
          {truncateDescription(
            exhibition.description ?? "",
            configurations.MAX_DESCRIPTION_LENGTH,
          )}
        </p>
      </div>
    </div>
  );
};

export default VisitorExhibitionCard;
