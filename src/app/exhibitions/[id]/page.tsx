"use client";

import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const ExhibitionEditorPage = () => {
  const params = useParams(); 
  const { id } = params;

  const [editorContent, setEditorContent] = useState<string>("");

  const handleEditorChange = (event: any, editor: any) => {
    const data = editor.getData();
    setEditorContent(data); 
    console.log("Editor content:", data);
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">Edit Exhibition {id}</h1>

      <CKEditor
        editor={ClassicEditor}
        data={editorContent}
        onChange={handleEditorChange}
      />

      <div className="mt-4">
        <h2 className="text-xl font-semibold">Editor Preview:</h2>
        <div dangerouslySetInnerHTML={{ __html: editorContent }} />
      </div>
    </div>
  );
};

export default ExhibitionEditorPage;