"use client";

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { api } from "~/trpc/react";
import { ExhibitionDataForm } from '~/app/_components/exhibition-data-form';
import ExhibitionContentEditor from '~/app/_components/exhibition-content-editor';
import { usePublishExhibition, useUpdateExhibition } from '~/hooks/exhibition-actions';
import type { Exhibition } from '~/lib/types/entities';
import { useWarnIfUnsavedChanges } from '~/hooks/useWarnIfUnsavedChanges';
import { useTranslation } from 'react-i18next';
import { useExhibitionIdFromParams } from '~/hooks/useExhibitionIdFromParams';
import ExhibitionPreviewModal from '~/app/_components/exhibition-preview-modal';
import { convertToValidHTML } from '~/lib/utils/exhibition-parser';

const ExhibitionEditorPage = () => {
  const id = useExhibitionIdFromParams();
  const [exhibition, setExhibition] = useState<Exhibition | null>(null);
  const [editorContent, setEditorContent] = useState<string>();
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
    }
  }, [exhibitionData]);

  useEffect(() => {
    // Toggle body overflow when the preview modal is open/closed
    if (isPreviewModalOpen) {
      document.body.style.overflow = 'hidden'; // Disable scroll
    } else {
      document.body.style.overflow = ''; // Re-enable scroll
    }
    return () => {
      document.body.style.overflow = ''; // Reset on unmount
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
      content: convertToValidHTML(editorContent)
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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" aria-hidden="true" />
      )}
      <div
        className={`flex flex-col lg:flex-row justify-between min-h-screen p-4 lg:p-8 space-y-4 lg:space-y-0 lg:space-x-4 ${
          isPreviewModalOpen ? 'pointer-events-none opacity-50' : ''
        }`}
        aria-hidden={isPreviewModalOpen}
      >
        <div className="flex-1 w-full lg:w-[70%] mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">{t("editExhibition")} {id}</h1>
          <p>{t("status")}: {updateExhibition.isPending ? t("saving") : t("saved")}</p>
          {exhibition && (
            <div className="w-full">
              <ExhibitionContentEditor
                initialContent={exhibition.content ?? ""}
                onChange={handleEditorChange}
              />
            </div>
          )}
        </div>
        {exhibition && (
          <aside className="w-full lg:w-[30%] mt-4 lg:mt-0 mx-auto">
            <div className="flex flex-wrap justify-end m-4 gap-2">
              <button
                type="button"
                className="bg-gray-500 text-text-light px-4 py-2 rounded-md hover:bg-gray-600 text-sm md:text-base"
                onClick={() => router.push(`/dashboard`)}
              >
                {t("exit")}
              </button>
              <button
                data-testid="save-editor-changes"
                type="button"
                className="bg-gray-500 text-text-light px-4 py-2 rounded-md hover:bg-gray-600 text-sm md:text-base"
                disabled={updateExhibition.isPending || publishExhibition.isPending}
                onClick={handleSaveEditorChanges}
              >
                {t("saveChanges")}
              </button>
              <button
                type="button"
                className="bg-blue-500 text-text-light px-4 py-2 rounded-md hover:bg-blue-600 text-sm md:text-base"
                onClick={() => setIsPreviewModalOpen(true)}
              >
                {t("preview")}
              </button>
              <button
                type="button"
                className="bg-blue-800 text-text-light px-3 py-2 rounded-md hover:bg-blue-400 text-sm md:text-base"
                onClick={() => router.push(`/dashboard/${id}/quizzes`)}
              >
                {t("createQuiz")}
              </button>
              <button
                type="button"
                className="bg-lime-600 text-text-light px-3 py-2 rounded-md hover:bg-lime-500 disabled:pointer-events-none text-sm md:text-base"
                disabled={updateExhibition.isPending || publishExhibition.isPending}
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
