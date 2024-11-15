

import React, { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Settings } from "lucide-react";
import { configurations } from "~/lib/constants/config";
import {
  useDeleteExhibition,
  usePublishExhibition,
  useUnpublishExhibition,
  useArchiveExhibition,
  useUnarchiveExhibition,
} from "~/hooks/exhibition-actions";
import { type Exhibition } from "~/lib/types/exhibition";

const DropdownMenu = dynamic(() => import("~/components/ui/dropdown-menu").then((mod) => mod.DropdownMenu));
const DropdownMenuTrigger = dynamic(() => import("~/components/ui/dropdown-menu").then((mod) => mod.DropdownMenuTrigger));
const DropdownMenuContent = dynamic(() => import("~/components/ui/dropdown-menu").then((mod) => mod.DropdownMenuContent));
const DropdownMenuItem = dynamic(() => import("~/components/ui/dropdown-menu").then((mod) => mod.DropdownMenuItem));

interface ExhibitionCardProps {
  exhibition: Exhibition;
  onClick: (id: number) => void;
  isArchivePage?: boolean;
}
export default function ExhibitionCard({ exhibition, onClick,   isArchivePage = false,
}: ExhibitionCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const deleteExhibition = useDeleteExhibition();
  const publishExhibition = usePublishExhibition();
  const unpublishExhibition = useUnpublishExhibition();
  const archiveExhibition = useArchiveExhibition();
  const unarchiveExhibition = useUnarchiveExhibition();

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/dashboard/${exhibition.id}`);
    setIsMenuOpen(false);
  };

  const handleArchive = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!exhibition.isPublished && exhibition.isArchived !== null && !exhibition.isArchived && window.confirm("Are you sure you want to archive this exhibition?")) {
      archiveExhibition.mutate({ id: exhibition.id });
    }
  };

  const handleUnarchive = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (exhibition.isArchived && window.confirm("Are you sure you want to unarchive this exhibition?")) {
      unarchiveExhibition.mutate({ id: exhibition.id });
    }
  };

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick(exhibition.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      exhibition.id &&
      !exhibition.isPublished &&
      window.confirm("Are you sure you want to delete this exhibition?")
    ) {
      deleteExhibition.mutate({ id: exhibition.id });
      setIsMenuOpen(false);
    }
  };

  const handleChangePublishedState = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (exhibition.id) {
      if (exhibition.isPublished) {
        if (
          window.confirm(
            "Are you sure you want to move this exhibition back to drafts?"
          )
        ) {
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
    <div className="mt-8">
      <div
        data-testid="exhibition-card"
        className="relative flex h-48 w-full cursor-pointer overflow-hidden rounded-lg bg-background_dark p-4 md:w-[320px]"
        onClick={() => onClick(exhibition.id)}
      >
        <div className="flex w-full">
          <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-md bg-gray-200">
            <Image
              src={exhibition.coverImageUrl ?? configurations.DEFAULT_COVER_IMAGE_URL}
              alt={exhibition.name ?? "Exhibition"}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="flex flex-grow flex-col justify-start pl-3 pr-2">
            <h2 className="text-dark truncate text-l font-semibold pt-4">{exhibition.name}</h2>
            <p className="mt-1 text-sm text-text-dark">
              {truncateDescription(exhibition.description ?? "", configurations.MAX_DESCRIPTION_LENGTH)}
            </p>
          </div>
        </div>

        <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <DropdownMenuTrigger asChild>
            <button
              className="absolute right-1 top-1 p-2 text-gray-600 hover:text-gray-800"
              aria-label="Card options"
              data-testid="card-options-button"
              onClick={(e) => e.stopPropagation()}
            >
              <Settings className="h-5 w-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36 bg-white">
            {isArchivePage ? (
              <>
                <DropdownMenuItem
                  onClick={handleUnarchive}
                  className="hover:font-semibold"
                >
                  Unarchive
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleView}
                  className="hover:font-semibold"
                >
                  View
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem
                  onClick={handleEdit}
                  className={`hover:font-semibold ${exhibition.isPublished ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={exhibition.isPublished}
                >
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleChangePublishedState}
                  className="hover:font-semibold"
                >
                  {exhibition.isPublished ? "Move to Drafts" : "Publish"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleArchive}
                  className={`hover:font-semibold ${exhibition.isPublished ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={exhibition.isPublished}
                >
                  Archive
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  className={`hover:font-semibold text-red-500 ${exhibition.isPublished ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={exhibition.isPublished}
                >
                  Delete
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}


export function ExhibitionList({
  exhibitions,
  onExhibitionClick,
  isArchivePage = false,
}: {
  exhibitions: Exhibition[];
  onExhibitionClick: (id: number) => void;
  isArchivePage?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
      {exhibitions.map((exhibition) => (
        <ExhibitionCard
          key={exhibition.id}
          exhibition={exhibition}
          onClick={onExhibitionClick}
          isArchivePage={isArchivePage}
        />
      ))}
    </div>

  );
}