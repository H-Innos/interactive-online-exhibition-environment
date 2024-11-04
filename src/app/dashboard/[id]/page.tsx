"use client";

import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { api } from "~/trpc/react";
import { ExhibitionDataForm } from '~/app/_components/exhibition-data-form';
import ExhibitionContentEditor from '~/app/_components/exhibition-content-editor';
import { usePublishExhibition, useUpdateExhibition } from '~/hooks/exhibition-actions';
import type { Exhibition } from '~/app/_types/exhibition';

const ExhibitionEditorPage = () => {
  const { id } = useParams();
  const [exhibition, setExhibition] = useState<Exhibition | null>(null);
  const { data: exhibitionData} = api.exhibition.getOne.useQuery({ id: Number(id) });

  const router = useRouter();

  useEffect(() => {
    if (exhibitionData) {
      setExhibition(exhibitionData);
    }
  }, [exhibitionData]);

  const updateExhibition = useUpdateExhibition();
  const publishExhibition = usePublishExhibition();

  function saveData(data: string): Promise<void> {
    if (!exhibition) return Promise.resolve();
    return updateExhibition.mutateAsync({
      id: exhibition.id,
      name: exhibition.name ?? "",
      content: data
    });
  }

  function handlePublish() {
    if (!exhibition || !window.confirm("Are you sure you want to publish this exhibition?")) return;
    publishExhibition.mutate({ id: exhibition.id });
  }

  return (
    
      <div className="flex justify-between min-h-screen p-8">
        <div>
          <h1 className="text-3xl font-bold mb-4">Edit Exhibition {id}</h1>
          <p>Status: {updateExhibition.isPending ? "Saving..." : "Saved"}</p> 
          { exhibition && 
          (
            <div className='max-w-5xl justify-center'> 
              <ExhibitionContentEditor
                initialContent={exhibition.content ?? ""} 
                saveData={saveData}
              />    
              
            </div>  
          )}
        </div>
        { exhibition && (
          <aside className='w-80'>
            <div className='flex flex-row justify-end m-4'>
              <button
                type="button"
                className="bg-gray-500 text-text-light mt-4 px-4 py-2 rounded-md hover:bg-gray-600"
                onClick={() => router.push(`/dashboard`)}
              >
                Exit
              </button>
              <button
                type='button'
                className="bg-lime-600 text-text-light mt-4 ml-4 px-3 py-2 rounded-md hover:bg-lime-500 disabled:pointer-events-none"
                disabled={updateExhibition.isPending}
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