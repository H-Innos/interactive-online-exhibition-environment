"use client"; 

import { useParams } from 'next/navigation';
import React from 'react';

const ExhibitionEditorPage = () => {
  const params = useParams(); 
  const { id } = params;
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">Edit Exhibition {id}</h1>
      <p>This is where the editor will be for exhibition ID: {id}</p>
    </div>
  );
};

export default ExhibitionEditorPage;
