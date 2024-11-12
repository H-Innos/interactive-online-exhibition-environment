"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Settings } from "lucide-react";
import type { Exhibition } from "../../lib/types/exhibition";
import {
  useDeleteExhibition,
  usePublishExhibition,
  useUnpublishExhibition,
} from "~/hooks/exhibition-actions";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "~/components/ui/dropdown-menu";
import { configurations } from "~/lib/constants/config";

interface ExhibitionCardProps {
  exhibition: Exhibition;
  onClick: (id: number) => void;
  showOptions?: boolean;
}

const ExhibitionCard: React.FC<ExhibitionCardProps> = ({
  exhibition,
  onClick,
  showOptions = false,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const deleteExhibition = useDeleteExhibition();
  const publishExhibition = usePublishExhibition();
  const unpublishExhibition = useUnpublishExhibition();

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/dashboard/${exhibition.id}`);
    setIsMenuOpen(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (exhibition.id && !exhibition.isPublished && window.confirm("Are you sure you want to delete this exhibition?")) {
      deleteExhibition.mutate({ id: exhibition.id });
      setIsMenuOpen(false);
    }
  };

  const handleChangePublishedState = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (exhibition.id) {
      if (exhibition.isPublished) {
        if (window.confirm("Are you sure you want to move this exhibition back to drafts?")) {
          unpublishExhibition.mutate({ id: exhibition.id });
        }
      } else {
        if (window.confirm("Are you sure you want to publish this exhibition?")) {
          publishExhibition.mutate({ id: exhibition.id });
        }
      }
      setIsMenuOpen(false);
    }
  };

  const truncateDescription = (text: string, maxLength: number) =>
    text.length <= maxLength ? text : `${text.slice(0, maxLength)}...`;

  return (
    <div
      className="relative flex h-48 w-full cursor-pointer overflow-hidden rounded-lg bg-gray-100 p-4 shadow hover:shadow-lg transition-shadow"
      onClick={() => onClick(exhibition.id)}
    >
      <div className="flex w-full">
        <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-md bg-gray-200">
          <Image
            src={exhibition.coverImageUrl ?? configurations.DEFAULT_COVER_IMAGE_URL}
            alt={exhibition.name}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="flex flex-grow flex-col justify-start pl-3 pr-2">
          <h2 className="text-dark truncate text-lg font-semibold pt-4">{exhibition.name}</h2>
          <p className="mt-1 text-sm text-gray-600">
            {truncateDescription(exhibition.description ?? "", 100)}
          </p>
        </div>
      </div>

      {showOptions && (
        <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <DropdownMenuTrigger asChild>
            <button
              className="absolute right-1 top-1 p-2 text-gray-600 hover:text-gray-800"
              aria-label="Card options"
              onClick={(e) => e.stopPropagation()}
            >
              <Settings className="h-5 w-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36 bg-white">
            <DropdownMenuItem
              onClick={handleEdit}
              className={`hover:font-semibold ${exhibition.isPublished ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={exhibition.isPublished}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleChangePublishedState} className="hover:font-semibold">
              {exhibition.isPublished ? "Unpublish" : "Publish"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              className={`text-red-600 hover:font-semibold hover:text-red-600 ${exhibition.isPublished ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={exhibition.isPublished}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default ExhibitionCard;
