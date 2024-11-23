"use client";

import React, { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { ExhibitionDataForm } from "~/app/_components/exhibition-data-form";
import ExhibitionContentEditor from "~/app/_components/exhibition-content-editor";
import type { Exhibition } from "~/lib/types/entities";
import { useWarnIfUnsavedChanges } from "~/hooks/useWarnIfUnsavedChanges";
import { useTranslation } from "react-i18next";
import { useExhibitionIdFromParams } from "~/hooks/useExhibitionIdFromParams";
import ExhibitionPreviewModal from "~/app/_components/exhibition-preview-modal";
import ExhibitionToolbar from "~/app/_components/editor-toolbar";

const ExhibitionEditorPage = () => {
  const id = useExhibitionIdFromParams();
  const [editorState, setEditorState] = useState<Exhibition | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const { data: exhibitionData } = api.exhibition.getOne.useQuery({ id: id });

  useWarnIfUnsavedChanges(isDirty);
  const { t } = useTranslation();

  useEffect(() => {
    if (exhibitionData) {
      setEditorState({
        ...exhibitionData,
        content: exhibitionData.content ?? "",
        backgroundColor: exhibitionData.backgroundColor ?? "#ffffff",
      });
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

  function handleEditorChange(updatedContent: string) {
    setEditorState((prevState) => {
      if (!prevState) return null;
      return { ...prevState, content: updatedContent };
    });
    setIsDirty(true);
  }

  function handleBackgroundColorChange(color: string) {
    setEditorState((prevState) => {
      if (!prevState) return null;
      return { ...prevState, backgroundColor: color };
    });
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
          exhibition={editorState}
          setBackgroundColor={handleBackgroundColorChange}
          setIsDetailsModalOpen={setIsDetailsModalOpen}
          setIsPreviewModalOpen={setIsPreviewModalOpen}
          setIsDirty={setIsDirty}
        />

        <div
          className={`flex flex-1 flex-col justify-between space-y-4 p-4 lg:flex-row lg:space-x-4 lg:space-y-0 lg:p-8 ${
            isPreviewModalOpen ? "pointer-events-none opacity-50" : ""
          }`}
          aria-hidden={isPreviewModalOpen}
          style={{ backgroundColor: editorState?.backgroundColor ?? "#ffffff" }}
        >

          <div className="mx-auto w-full flex-1 lg:w-[70%]">
            {editorState && (
              <div className="w-full">
                <ExhibitionContentEditor
                  initialContent={editorState.content ?? ""}
                  onChange={handleEditorChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {isDetailsModalOpen && editorState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[600px]">
            <h2 className="text-xl font-bold mb-4">{t("exhibitionDetails")}</h2>
            <ExhibitionDataForm exhibition={editorState} />
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

      {isPreviewModalOpen && editorState && (
        <ExhibitionPreviewModal
          exhibition={editorState}
          onClose={() => setIsPreviewModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ExhibitionEditorPage;