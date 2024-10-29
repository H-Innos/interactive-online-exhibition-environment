"use client";

import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import React, { useEffect, useState } from "react";
import type { Exhibition } from "~/app/_types/exhibition";

import 'ckeditor5/ckeditor5.css';

const ExhibitionViewPage: React.FC = () => {
  const { id } = useParams();
  const [exhibition, setExhibition] = useState<Exhibition | null>(null);

  const { data, error, isLoading } = api.exhibition.getOne.useQuery({ id: Number(id) });

  useEffect(() => {
    if (data) {
      setExhibition(data);
    }
  }, [data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !exhibition) {
    return <div>Error loading exhibition.</div>;
  }

  return (
    <div className="text-text-dark min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-4 text-center">{exhibition.name}</h1>
      <div dangerouslySetInnerHTML={{ __html: exhibition.content ?? "" }} className="ck-content" />
    </div>
  );
};

export default ExhibitionViewPage;