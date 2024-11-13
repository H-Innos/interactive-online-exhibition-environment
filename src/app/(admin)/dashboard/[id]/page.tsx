"use client";

import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { api } from "~/trpc/react";
import { ExhibitionDataForm } from '~/app/_components/exhibition-data-form';
import ExhibitionContentEditor from '~/app/_components/exhibition-content-editor';
import { usePublishExhibition, useUpdateExhibition } from '~/hooks/exhibition-actions';
import type { Exhibition } from '~/lib/types/exhibition';
import { useWarnIfUnsavedChanges } from '~/hooks/useWarnIfUnsavedChanges';
import type { Editor, EventInfo } from 'ckeditor5';

const ExhibitionEditorPage = () => {
  const { id } = useParams();
  const [exhibition, setExhibition] = useState<Exhibition | null>(null);
  const [editorContent, setEditorContent] = useState<string>();
  const [isDirty, setIsDirty] = useState(false);
  const { data: exhibitionData } = api.exhibition.getOne.useQuery({ id: Number(id) });

  const router = useRouter();
  useWarnIfUnsavedChanges(isDirty);

  useEffect(() => {
    if (exhibitionData) {
      setExhibition(exhibitionData);
      setEditorContent(exhibitionData.content ?? "");
    }
  }, [exhibitionData]);

  const publishExhibition = usePublishExhibition();
  const updateExhibition = useUpdateExhibition();

  function handlePublish() {
    if (!exhibition || !window.confirm("Are you sure you want to publish this exhibition?")) return;
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
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Edit Exhibition {id}</h1>
        <p>Status: {updateExhibition.isPending ? "Saving..." : "Saved"}</p>
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
              Exit
            </button>
            <button
              type="button"
              className="bg-gray-500 text-text-light mt-4 px-4 py-2 rounded-md hover:bg-gray-600"
              disabled={updateExhibition.isPending || publishExhibition.isPending}
              onClick={handleSaveEditorChanges}
            >
              Save changes
            </button>
            <button
              type="button"
              className="bg-lime-600 text-text-light mt-4 px-3 py-2 rounded-md hover:bg-lime-500 disabled:pointer-events-none"
              disabled={updateExhibition.isPending || publishExhibition.isPending}
              onClick={handlePublish}
            >
              {publishExhibition.isPending ? "Publishing..." : "Publish"}
            </button>
          </div>
          <ExhibitionDataForm exhibition={exhibition} />
        </aside>
      )}
    </div>
  );
};

export default ExhibitionEditorPage;
