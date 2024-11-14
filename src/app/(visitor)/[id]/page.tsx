"use client";

import { useParams, useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import React, { useEffect, useState } from "react";
import type { Exhibition } from "~/lib/types/exhibition";

import 'ckeditor5/ckeditor5.css';

const ExhibitionViewPage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
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
      <div
        className="relative h-64 w-full bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `url(${exhibition.coverImageUrl || '/default-cover.jpg'})`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <button
          onClick={() => router.push('/')}
          className="absolute left-4 text-white text-5xl z-10"
        >
          ❬
        </button>
        <h1 className="relative text-4xl font-bold text-white z-10">
          {exhibition.name}
        </h1>
      </div>
      <div dangerouslySetInnerHTML={{ __html: exhibition.content ?? "" }} className="ck-content mt-8" />
    </div>
  );
};

export default ExhibitionViewPage;