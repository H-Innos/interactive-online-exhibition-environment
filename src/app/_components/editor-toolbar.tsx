import React, { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";
import { ColorPicker } from "~/components/color-picker";
import { useTranslation } from "react-i18next";
import { Save, Eye, FilePlus, Info, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePublishExhibition, useUpdateExhibition } from "~/hooks/exhibition-actions";
import CoverImage from "~/components/cover-image";
import FileUploadButton from "~/components/file-upload-button";
import type { Exhibition } from "~/lib/types/entities";
import { configurations } from "~/lib/constants/config";

interface ExhibitionToolbarProps {
  exhibition: Exhibition | null;
  setBackgroundColor: (color: string) => void;
  setIsDetailsModalOpen: (isOpen: boolean) => void;
  setIsPreviewModalOpen: (isOpen: boolean) => void;
  setIsDirty: (isDirty: boolean) => void;
}

const ExhibitionToolbar: React.FC<ExhibitionToolbarProps> = ({
  exhibition,
  setBackgroundColor,
  setIsDetailsModalOpen,
  setIsPreviewModalOpen,
  setIsDirty,
}) => {
  const router = useRouter();
  const { t } = useTranslation();
  const updateExhibition = useUpdateExhibition();
  const publishExhibition = usePublishExhibition();

  const [localCoverUrl, setLocalCoverUrl] = useState<string | null>(exhibition?.exhibitionCoverUrl ?? null);

  const handlePositionChange = (newPosition: { x: number; y: number }) => {
    if (exhibition) {
      exhibition.coverImagePositionX = newPosition.x;
      exhibition.coverImagePositionY = newPosition.y;
      setIsDirty(true);
    }
  };

  const handleFileSelect = async (file: File) => {
    try {
      const uploadedImageUrl = await uploadImage(file);
      setLocalCoverUrl(uploadedImageUrl);
      if (exhibition) {
        exhibition.exhibitionCoverUrl = uploadedImageUrl;
        setIsDirty(true);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  async function uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    interface UploadResponse {
      url: string;
    }

    const data: UploadResponse = await response.json() as UploadResponse;
    return data.url;
}

  function handleSaveEditorChanges() {
    if (exhibition) {
      const exhibitionData = {
        ...exhibition,
        coverImagePositionX: Math.round(exhibition.coverImagePositionX),
        coverImagePositionY: Math.round(exhibition.coverImagePositionY),
        description: exhibition.description ?? undefined,
        exhibitionCoverUrl: exhibition.exhibitionCoverUrl ?? undefined,
        thumbnailUrl: exhibition.thumbnailUrl ?? undefined,
        content: exhibition.content ?? undefined,
        backgroundColor: exhibition.backgroundColor ?? undefined,
      };

      updateExhibition.mutate(exhibitionData, {
        onSuccess: () => {
          setIsDirty(false);
        },
      });
    }
  }

  function handlePublish() {
    if (exhibition) {
      const isConfirmed = window.confirm(t("confirmPublish"));
      if (isConfirmed) {
        publishExhibition.mutate({ id: exhibition.id }, {
          onSuccess: () => {
            setIsDirty(false);
          },
        });
      }
    }
  }

  function handleColorChange(color: string) {
    setBackgroundColor(color);
  }

  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center justify-between p-4 bg-white shadow-md gap-4">
        <div className="flex items-center w-full sm:w-auto">
          <button
            type="button"
            className="ml-8 text-4xl mr-8"
            onClick={() => router.push(`/dashboard`)}
          >
            ❬
          </button>
          <h1 className="text-xl font-bold md:text-2xl">
            {t("editExhibition")} {exhibition?.name ?? "Exhibition"}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <label htmlFor="background-color" className="text-sm font-medium text-gray-700">
            {t("backgroundColor")}
          </label>
          <div className="w-full sm:w-[200px]">
            <ColorPicker
              onColorSelect={handleColorChange}
              initialColor={exhibition?.backgroundColor ?? "#000000"}
            />
          </div>

          <FileUploadButton
            onFileSelect={handleFileSelect}
            accept="image/*"
          />

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 bg-white hover:bg-gray-100"
                onClick={() => router.push(`/dashboard/${exhibition?.id}/quizzes`)}
                data-testid="create-quiz"
              >
                <FilePlus className="h-5 w-5 text-black" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("createQuiz")}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 bg-white hover:bg-gray-100"
                onClick={() => setIsDetailsModalOpen(true)}
              >
                <Info className="h-5 w-5 text-black" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("details")}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 bg-white hover:bg-gray-100"
                onClick={() => setIsPreviewModalOpen(true)}
              >
                <Eye className="h-5 w-5 text-black" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("preview")}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                data-testid="save-editor-changes"
                type="button"
                className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 bg-white hover:bg-gray-100"
                onClick={handleSaveEditorChanges}
              >
                <Save className="h-5 w-5 text-black" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("saveChanges")}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 bg-white hover:bg-gray-100 mr-8"
                onClick={handlePublish}
                data-testid="publish-exhibition"
              >
                <Check className="h-5 w-5 text-black" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("publish")}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {exhibition && (
          <CoverImage
          exhibitionCoverUrl={localCoverUrl ?? exhibition.exhibitionCoverUrl ?? exhibition.thumbnailUrl}
            initialPosition={{
              x: exhibition.coverImagePositionX ?? configurations.DEFAULT_EXHIBITION_COVER_PLACEMENT,
              y: exhibition.coverImagePositionY ?? configurations.DEFAULT_EXHIBITION_COVER_PLACEMENT,
            }}
            onPositionChange={handlePositionChange}
          />
        )}
      </div>
    </TooltipProvider>
  );
};

export default ExhibitionToolbar;