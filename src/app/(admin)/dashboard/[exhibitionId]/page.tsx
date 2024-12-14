"use client";

import React, { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import ExhibitionContentEditor from "~/app/_components/exhibition-content-editor";
import type { Exhibition } from "~/lib/types/entities";
import { useWarnIfUnsavedChanges } from "~/hooks/useWarnIfUnsavedChanges";
import { useTranslation } from "react-i18next";
import { useExhibitionIdFromParams } from "~/hooks/useExhibitionIdFromParams";
import ExhibitionPreviewModal from "~/app/_components/exhibition-preview-modal";
import ExhibitionToolbar from "~/app/_components/editor-toolbar";
import { convertToValidHTML } from "~/lib/utils/exhibition-parser";
import ExhibitionTabs from "~/components/details-tabs";

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

  async function handleEditorChange(updatedContent: string) {
    const validHTMLContent = convertToValidHTML(updatedContent);
    setEditorState((prevState) => {
      if (!prevState) return null;
      const isContentChanged = prevState.content !== validHTMLContent;
      if (isContentChanged) {
        setIsDirty(true);
      }
      return { ...prevState, content: validHTMLContent };
    });
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
      <div className="flex min-h-screen flex-col">
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
                  bgColor={editorState?.backgroundColor ?? "#ffffff"}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {isDetailsModalOpen && editorState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative h-[90%] w-[90%] max-w-lg rounded-lg bg-white p-4 shadow-lg md:p-6">
            <button
              type="button"
              className="flex w-full flex-row justify-end text-4xl text-gray-500 hover:text-gray-600"
              onClick={() => setIsDetailsModalOpen(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <ExhibitionTabs
              exhibition={editorState}
              onSave={() => setIsDetailsModalOpen(false)}
            />
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
