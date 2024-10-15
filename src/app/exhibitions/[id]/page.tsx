"use client"; 

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { api } from "~/trpc/react";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CldImage } from 'next-cloudinary';

import { Exhibition } from '../page';

// custom upload adapter for CKEditor to handle Cloudinary uploads
class Uploader {
  loader: any;
  constructor(loader: any) {
    this.loader = loader; // assigns the loader
  }

  upload() {
    console.log("Attempting to upload the file...");
    return this.loader.file
      .then((file: File) => {
        if (!file) {
          console.error("No file found.");
          throw new Error('File is not available.');
        }

        console.log("File found:", file);

        return new Promise((resolve, reject) => {
          const formData = new FormData();
          formData.append('file', file);

          fetch('/api/upload', {
            method: 'POST',
            body: formData,
          })
            .then(response => response.json())
            .then(result => {
              if (result.url) {
                console.log("File uploaded successfully:", result.url);
                resolve({
                  default: result.url, // Cloudinary URL for the image
                });
              } else {
                console.error("No URL in the response.");
                reject('No URL in the response');
              }
            })
            .catch(error => {
              console.error("Error during file upload:", error);
              reject(error);
            });
        });
      })
      .catch((error: any) => {
        console.error('Upload failed:', error);
        return Promise.reject(error);
      });
  }
}

// plugin for CKEditor to use uploader for Cloudinary uploads
function UploaderPlugin(editor: any) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
    return new Uploader(loader);
  };
}

// exhibition editor component
const ExhibitionEditorPage = () => {
  const params = useParams(); 
  const { id } = params;

  const [exhibition, setExhibition] = useState<Exhibition | null>(null);
  const [editorContent, setEditorContent] = useState<string>("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const { data, error, isLoading } = api.post.getOne.useQuery({ id: id });

  useEffect(() => {
    if (data) {
      setExhibition(data);
    }
  }, [data]);

  const handleEditorChange = (event: any, editor: any) => {
    const data = editor.getData();
    setEditorContent(data); 
    console.log("Editor content:", data);
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">Edit Exhibition {id}</h1>

        {exhibition && (
          <div>
          <label className="block text-sm font-medium text-text-dark mb-1">Title</label>
          <input
            type="text"
            value={exhibition.name || ""}
            // onChange={(e) => setName(e.target.value)}
            placeholder="Enter exhibition title"
            className="w-full rounded-md border border-gray-300 focus:ring focus:ring-primary-dark focus:ring-opacity-90 px-4 py-2"
          />
          </div>
        )}

      <br/>

      {/* CKEditor with adapter for Cloudinary */}
      <CKEditor
        editor={ClassicEditor}
        data={editorContent}
        onChange={handleEditorChange}
        config={{
          extraPlugins: [UploaderPlugin],
        }}
      />

      {/* editor preview */}
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Editor Preview:</h2>
        <div dangerouslySetInnerHTML={{ __html: editorContent }} />
      </div>

      {/* display uploaded image*/}
      {exhibition && exhibition.coverImageUrl && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold">Uploaded Image Preview:</h2>
          {/* <CldImage
            src={exhibition.coverImageUrl}
            width="500"
            height="500"
            crop="fill"
            alt="Uploaded Image"
          /> */}
          <img src={exhibition.coverImageUrl} width="300px" />
        </div>
      )}
    </div>
  );
};

export default ExhibitionEditorPage;
