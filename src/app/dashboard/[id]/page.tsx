"use client";

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { api } from "~/trpc/react";
import { ExhibitionDataForm } from '~/app/_components/exhibition-data-form';
import ExhibitionContentEditor from '~/app/_components/exhibition-content-editor';
import { useUpdateExhibition } from '~/hooks/exhibition-actions';
import type { Exhibition } from '~/app/_types/exhibition';

const ExhibitionEditorPage = () => {
  const { id } = useParams();
  const [exhibition, setExhibition] = useState<Exhibition | null>(null);
  const { data: exhibitionData} = api.exhibition.getOne.useQuery({ id: Number(id) });

  useEffect(() => {
    if (exhibitionData) {
      setExhibition(exhibitionData);
    }
  }, [exhibitionData]);

  const updateExhibition = useUpdateExhibition();

  function saveData(data: string): Promise<void> {
    if (!exhibition) return Promise.resolve();
    return updateExhibition.mutateAsync({
      id: exhibition.id,
      name: exhibition.name ?? "",
      content: data
  });
}

  return (
    
      <div className="min-h-screen p-8">
        <h1 className="text-3xl font-bold mb-4">Edit Exhibition {id}</h1>
        <p>Status: {updateExhibition.isPending ? "Saving..." : "Saved"}</p> 
        { exhibition && 
        (
          <div className="flex flex-row h-screen justify-between">
          <div className='flex flex-col items-center'> 
            <ExhibitionContentEditor
              initialContent={exhibition.content ?? ""} 
              saveData={saveData}
            />    
          </div>
          <ExhibitionDataForm exhibition={exhibition} />
        </div>  
        )}
         
      </div>
      
  );
};

export default ExhibitionEditorPage;