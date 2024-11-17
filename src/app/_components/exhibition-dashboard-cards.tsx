"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Settings } from "lucide-react";
import type { Exhibition } from "../../lib/types/entities";
import {
  useDeleteExhibition,
  usePublishExhibition,
  useUnpublishExhibition,
  useArchiveExhibition,
} from "~/hooks/exhibition-actions";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "~/components/ui/dropdown-menu";
import { configurations } from "~/lib/constants/config";
import { useTranslation } from "react-i18next";

interface ExhibitionCardProps {
  exhibition: Exhibition;
  onClick: (id: number) => void;
}

const ExhibitionCard: React.FC<ExhibitionCardProps> = ({
  exhibition,
  onClick,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();

  const deleteExhibition = useDeleteExhibition();
  const publishExhibition = usePublishExhibition();
  const unpublishExhibition = useUnpublishExhibition();
  const archiveExhibition = useArchiveExhibition();

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (exhibition.id) {
      router.push(`/dashboard/${exhibition.id}`);
      setIsMenuOpen(false);
    }
  };

  const handleArchive = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      exhibition.id &&
      !exhibition.isPublished &&
      window.confirm(t("confirmArchive"))
    ) {
      archiveExhibition.mutate({ id: exhibition.id });
      setIsMenuOpen(false);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      exhibition.id &&
      !exhibition.isPublished &&
      window.confirm(t("confirmDelete"))
    ) {
      deleteExhibition.mutate({ id: exhibition.id });
      setIsMenuOpen(false);
    }
  };

  const handleChangePublishedState = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (exhibition.id) {
      if (exhibition.isPublished) {
        if (window.confirm(t("confirmUnpublish"))) {
          unpublishExhibition.mutate({ id: exhibition.id });
        }
      } else {
        if (window.confirm(t("confirmPublish"))) {
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
      className="relative flex h-48 w-100 cursor-pointer overflow-hidden rounded-lg bg-gray-100 p-4 shadow transition-shadow hover:shadow-lg"
      onClick={() => onClick(exhibition.id)}
    >
      <div className="flex w-full">
        <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-md bg-gray-200">
          <Image
            src={
              exhibition.coverImageUrl ?? configurations.DEFAULT_COVER_IMAGE_URL
            }
            alt={exhibition.name}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="flex flex-grow flex-col justify-start pl-3 pr-2">
          <h2 className="text-dark truncate pt-4 text-lg font-semibold">
            {exhibition.name}
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            {truncateDescription(exhibition.description ?? "", 100)}
          </p>
        </div>
      </div>

      <DropdownMenu
        open={isMenuOpen}
        onOpenChange={setIsMenuOpen}
        data-testid="card-options-button"
      >
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
            className={`hover:font-semibold ${exhibition.isPublished ? "cursor-not-allowed opacity-50" : ""}`}
            disabled={exhibition.isPublished}
          >
            {t("edit")}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleArchive}
            disabled={exhibition.isPublished}
            className={`hover:font-semibold ${exhibition.isPublished ? "cursor-not-allowed opacity-50" : ""}`}
          >
            {t("archive")}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleChangePublishedState}
            className="hover:font-semibold"
          >
            {exhibition.isPublished ? t("unpublish") : t("publish")}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDelete}
            className={`text-red-600 hover:font-semibold hover:text-red-600 ${exhibition.isPublished ? "cursor-not-allowed opacity-50" : ""}`}
            disabled={exhibition.isPublished}
          >
            {t("delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ExhibitionCard;