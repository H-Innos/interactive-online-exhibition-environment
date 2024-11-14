"use client";

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { api } from "~/trpc/react";
import { ExhibitionDataForm } from '~/app/_components/exhibition-data-form';
import ExhibitionContentEditor from '~/app/_components/exhibition-content-editor';
import { usePublishExhibition, useUpdateExhibition } from '~/hooks/exhibition-actions';
import type { Exhibition } from '~/lib/types/entities';
import { useWarnIfUnsavedChanges } from '~/hooks/useWarnIfUnsavedChanges';
import type { Editor, EventInfo } from 'ckeditor5';
import { useTranslation } from 'react-i18next';
import useExhibitionIdFromParams from '~/hooks/useExhibitionIdFromParams';
import { Button } from '~/components/ui/button';

const ExhibitionEditorPage = () => {
  const id = useExhibitionIdFromParams();
  const [exhibition, setExhibition] = useState<Exhibition | null>(null);
  const [editorContent, setEditorContent] = useState<string>();
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
      content: editorContent
    });
    setIsDirty(false);
  }

  function handleEditorChange(event: EventInfo<string, unknown>, editor: Editor) {
    setEditorContent(editor.getData());
    setIsDirty(true);
  }

  return (
    <div className="flex flex-col lg:flex-row justify-between min-h-screen p-4 lg:p-8 space-y-4 lg:space-y-0 lg:space-x-4">
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
          <div className="flex flex-row justify-end m-4 gap-2">
            <button
              type="button"
              className="bg-gray-500 text-text-light mt-4 px-4 py-2 rounded-md hover:bg-gray-600"
              onClick={() => router.push(`/dashboard`)}
            >
              {t("exit")}
            </button>
            <button
              type="button"
              className="bg-gray-500 text-text-light mt-4 px-4 py-2 rounded-md hover:bg-gray-600"
              disabled={updateExhibition.isPending || publishExhibition.isPending}
              onClick={handleSaveEditorChanges}
            >
              {t("saveChanges")}
            </button>
            <button
              type="button"
              className="bg-lime-600 text-text-light mt-4 px-3 py-2 rounded-md hover:bg-lime-500 disabled:pointer-events-none"
              disabled={updateExhibition.isPending || publishExhibition.isPending}
              onClick={handlePublish}
            >
              {publishExhibition.isPending ? t("publishing") : t("publish")}
            </button>
          </div>
          <ExhibitionDataForm exhibition={exhibition} />
          <Button
            onClick={() => router.push(`/dashboard/${id}/quizzes`)}
            className='mt-4'
          >
            Create Quiz
          </Button>
        </aside>
      )}
    </div>
  );
};

export default ExhibitionEditorPage;