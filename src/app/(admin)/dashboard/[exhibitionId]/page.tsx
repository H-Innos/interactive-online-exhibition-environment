"use client";

import { useRouter } from "next/navigation";
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

const ExhibitionEditorPage = () => {
  const id = useExhibitionIdFromParams();
  const [exhibition, setExhibition] = useState<Exhibition | null>(null);
  const [editorContent, setEditorContent] = useState<string>();
  const [backgroundColor, setBackgroundColor] = useState<string>("#ffffff");
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const { data: exhibitionData } = api.exhibition.getOne.useQuery({ id: id });

  const router = useRouter();
  useWarnIfUnsavedChanges(isDirty);
  const { t } = useTranslation();

  useEffect(() => {
    if (exhibitionData) {
      setExhibition(exhibitionData);
      setEditorContent(exhibitionData.content ?? "");
      setBackgroundColor(exhibitionData.backgroundColor ?? "#ffffff");
    }
  }, [exhibitionData]);

  useEffect(() => {
    if (isPreviewModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isPreviewModalOpen]);

  const publishExhibition = usePublishExhibition();
  const updateExhibition = useUpdateExhibition();

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

  function handleBackgroundColorChange(event: React.ChangeEvent<HTMLInputElement>) {
    setBackgroundColor(event.target.value);
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
      <div
        className={`flex min-h-screen flex-col justify-between space-y-4 p-4 lg:flex-row lg:space-x-4 lg:space-y-0 lg:p-8 ${
          isPreviewModalOpen ? "pointer-events-none opacity-50" : ""
        }`}
        aria-hidden={isPreviewModalOpen}
      >
        <div className="mx-auto w-full flex-1 lg:w-[70%]">
          <h1 className="mb-4 text-2xl font-bold md:text-3xl">
            {t("editExhibition")} {id}
          </h1>
          <p>
            {t("status")}:{" "}
            {updateExhibition.isPending ? t("saving") : t("saved")}
          </p>
          {exhibition && (
            <div className="w-full">
              <ExhibitionContentEditor
                initialContent={exhibition.content ?? ""}
                onChange={handleEditorChange}
              />
              <div className="mt-4">
                <label htmlFor="background-color" className="block text-sm font-medium text-gray-700">
                  {t("backgroundColor")}
                </label>
                <input
                  type="color"
                  id="background-color"
                  value={backgroundColor}
                  onChange={handleBackgroundColorChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          )}
        </div>
        {exhibition && (
          <aside className="mx-auto mt-4 w-full lg:mt-0 lg:w-[30%]">
            <div className="m-4 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                className="rounded-md bg-gray-500 px-4 py-2 text-sm text-text-light hover:bg-gray-600 md:text-base"
                onClick={() => router.push(`/dashboard`)}
              >
                {t("exit")}
              </button>
              <button
                data-testid="save-editor-changes"
                type="button"
                className="rounded-md bg-gray-500 px-4 py-2 text-sm text-text-light hover:bg-gray-600 md:text-base"
                disabled={
                  updateExhibition.isPending || publishExhibition.isPending
                }
                onClick={handleSaveEditorChanges}
              >
                {t("saveChanges")}
              </button>
              <button
                type="button"
                className="rounded-md bg-blue-500 px-4 py-2 text-sm text-text-light hover:bg-blue-600 md:text-base"
                onClick={() => setIsPreviewModalOpen(true)}
              >
                {t("preview")}
              </button>
              <button
                type="button"
                className="rounded-md bg-blue-800 px-3 py-2 text-sm text-text-light hover:bg-blue-400 md:text-base"
                onClick={() => router.push(`/dashboard/${id}/quizzes`)}
              >
                {t("createQuiz")}
              </button>
              <button
                type="button"
                className="rounded-md bg-lime-600 px-3 py-2 text-sm text-text-light hover:bg-lime-500 disabled:pointer-events-none md:text-base"
                disabled={
                  updateExhibition.isPending || publishExhibition.isPending
                }
                onClick={handlePublish}
              >
                {publishExhibition.isPending ? t("publishing") : t("publish")}
              </button>
            </div>
            <ExhibitionDataForm exhibition={exhibition} />
          </aside>
        )}
      </div>
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