"use client"; 

import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CldImage } from 'next-cloudinary';

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

  const [editorContent, setEditorContent] = useState<string>("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null); // stores uploaded image URL

  const handleEditorChange = (event: any, editor: any) => {
    const data = editor.getData();
    setEditorContent(data); 
    console.log("Editor content:", data);
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">Edit Exhibition {id}</h1>

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
      {uploadedImageUrl && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold">Uploaded Image Preview:</h2>
          <CldImage
            src={uploadedImageUrl}
            width="500"
            height="500"
            crop="fill"
            alt="Uploaded Image"
          />
        </div>
      )}
    </div>
  );
};

export default ExhibitionEditorPage;
