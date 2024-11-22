import React from "react";
import { useRouter } from "next/navigation";
import { Save, Eye, FilePlus, Info, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ColorPicker } from "~/components/color-picker";
import type { Exhibition } from "~/lib/types/entities";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip";

interface ExhibitionToolbarProps {
  exhibition: Exhibition | null;
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
  handleSaveEditorChanges: () => void;
  handlePublish: () => void;
  setIsDetailsModalOpen: (isOpen: boolean) => void;
  setIsPreviewModalOpen: (isOpen: boolean) => void;
  updateExhibitionPending: boolean;
  publishExhibitionPending: boolean;
}

const ExhibitionToolbar: React.FC<ExhibitionToolbarProps> = ({
  exhibition,
  backgroundColor,
  setBackgroundColor,
  handleSaveEditorChanges,
  handlePublish,
  setIsDetailsModalOpen,
  setIsPreviewModalOpen,
  updateExhibitionPending,
  publishExhibitionPending,
}) => {
  const router = useRouter();
  const { t } = useTranslation();

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
          <label
            htmlFor="background-color"
            className="text-sm font-medium text-gray-700"
          >
            {t("backgroundColor")}
          </label>
          <div className="w-full sm:w-[200px]">
            <ColorPicker onColorSelect={handleColorChange} />
          </div>

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
                disabled={updateExhibitionPending || publishExhibitionPending}
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
                disabled={updateExhibitionPending || publishExhibitionPending}
                onClick={handlePublish}
                data-testid="publish-exhibition"
              >
                <Check className="h-5 w-5 text-black" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{publishExhibitionPending ? t("publishing") : t("publish")}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ExhibitionToolbar;
