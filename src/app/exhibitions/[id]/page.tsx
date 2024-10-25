"use client";

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { api } from "~/trpc/react";

import type { Exhibition } from '~/app/_types/exhibition';
import MessageBanner from '~/app/_components/message-banner';
import ExhibitionEditor from '~/components/exhibition-editor';

const ExhibitionEditorPage = () => {
  const { id } = useParams() as { id: string };
  const [exhibition, setExhibition] = useState<Exhibition | null>(null);
  const { data: exhibitionData} = api.exhibition.getOne.useQuery({ id: Number(id) });

  useEffect(() => {
    if (exhibitionData) {
      setExhibition(exhibitionData);
    }
  }, [exhibitionData]);

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">Edit Exhibition {id}</h1>

      <MessageBanner />
      {
        exhibition && <ExhibitionEditor exhibition={exhibition} />
      }      
    </div>
  );
};

export default ExhibitionEditorPage;