"use client";

import React, { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { ExhibitionDataForm } from "~/app/_components/exhibition-data-form";
import ExhibitionContentEditor from "~/app/_components/exhibition-content-editor";
import {
  usePublishExhibition,
  useUpdateExhibition,
} from "~/hooks/exhibition-actions";
import type { Exhibition } from "~/lib/types/entities";
import { useWarnIfUnsavedChanges } from "~/hooks/useWarnIfUnsavedChanges";
import { useTranslation } from "react-i18next";
import { useExhibitionIdFromParams } from "~/hooks/useExhibitionIdFromParams";
import ExhibitionPreviewModal from "~/app/_components/exhibition-preview-modal";
import { convertToValidHTML } from "~/lib/utils/exhibition-parser";
import ExhibitionToolbar from "~/app/_components/editor-toolbar";

const ExhibitionEditorPage = () => {
  const id = useExhibitionIdFromParams();
  const [exhibition, setExhibition] = useState<Exhibition | null>(null);
  const [editorContent, setEditorContent] = useState<string>();
  const [backgroundColor, setBackgroundColor] = useState<string>("#ffffff");
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const { data: exhibitionData } = api.exhibition.getOne.useQuery({ id: id });

  useWarnIfUnsavedChanges(isDirty);
  const { t } = useTranslation();

  const publishExhibition = usePublishExhibition();
  const updateExhibition = useUpdateExhibition();

  useEffect(() => {
    if (exhibitionData) {
      setExhibition(exhibitionData);
      setEditorContent(exhibitionData.content ?? "");
      setBackgroundColor(exhibitionData.backgroundColor ?? "#ffffff");
    }
  }, [exhibitionData]);

  useEffect(() => {
    if (isPreviewModalOpen || isDetailsModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isPreviewModalOpen, isDetailsModalOpen]);

  function handlePublish() {
    if (!exhibition || !window.confirm(t("confirmPublish"))) return;
    publishExhibition.mutate({ id: exhibition.id });
  }

  function handleSaveEditorChanges() {
    if (!exhibition) return;
    updateExhibition.mutate({
      id: exhibition.id,
      name: exhibition.name,
      content: convertToValidHTML(editorContent),
      backgroundColor: backgroundColor,
    });
    setIsDirty(false);
  }

  function handleEditorChange(updatedContent: string) {
    setEditorContent(updatedContent);
    setIsDirty(true);
  }

  return (
    <div>
      {isPreviewModalOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50"
          aria-hidden="true"
        />
      )}
      <div className="flex flex-col min-h-screen">
        <ExhibitionToolbar
          exhibition={exhibition}
          backgroundColor={backgroundColor}
          setBackgroundColor={setBackgroundColor}
          handleSaveEditorChanges={handleSaveEditorChanges}
          handlePublish={handlePublish}
          setIsDetailsModalOpen={setIsDetailsModalOpen}
          setIsPreviewModalOpen={setIsPreviewModalOpen}
          updateExhibitionPending={updateExhibition.isPending}
          publishExhibitionPending={publishExhibition.isPending}
        />

        <div
          className={`flex flex-1 flex-col justify-between space-y-4 p-4 lg:flex-row lg:space-x-4 lg:space-y-0 lg:p-8 ${
            isPreviewModalOpen ? "pointer-events-none opacity-50" : ""
          }`}
          aria-hidden={isPreviewModalOpen}
        >
          <div className="mx-auto w-full flex-1 lg:w-[70%]">
            {exhibition && (
              <div className="w-full">
                <ExhibitionContentEditor
                  initialContent={exhibition.content ?? ""}
                  onChange={handleEditorChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {isDetailsModalOpen && exhibition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[600px]">
            <h2 className="text-xl font-bold mb-4">{t("exhibitionDetails")}</h2>
            <ExhibitionDataForm exhibition={exhibition} />
            <button
              type="button"
              className="mt-4 rounded-md bg-gray-500 px-4 py-2 text-sm text-white hover:bg-gray-600 md:text-base"
              onClick={() => setIsDetailsModalOpen(false)}
            >
              {t("close")}
            </button>
          </div>
        </div>
      )}

      {isPreviewModalOpen && exhibition && (
        <ExhibitionPreviewModal
          exhibition={exhibition}
          onClose={() => setIsPreviewModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ExhibitionEditorPage;