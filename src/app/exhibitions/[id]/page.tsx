"use client";

import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState, useRef } from 'react';
import { api } from "~/trpc/react";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CldImage } from 'next-cloudinary';

import { Exhibition } from '~/app/exhibitions/page';

// custom upload adapter for CKEditor to handle Cloudinary uploads
// TODO separate place for this
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
  const router = useRouter();
  const params = useParams(); 
  const { id } = params;

  const [exhibition, setExhibition] = useState<Exhibition | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);

  const [editorContent, setEditorContent] = useState<string>("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const utils = api.useUtils();

  const descriptionMaxLength = 130;
  const fileMaxSize = 5 * 1024 * 1024; // 5MB

  const { data, error, isLoading } = api.post.getOne.useQuery({ id: id });

  useEffect(() => {
    if (data) {
      setExhibition(data);
      setName(data.name);
      setDescription(data.description);
      setCoverImage(data.coverImageUrl);
      setEditorContent(data.content);
    }
  }, [data]);

  const updateExhibition = api.post.update.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate();
      setSuccessMessage("Exhibition updated successfully!");
      setErrorMessage("");
      setTimeout(() => {
        setSuccessMessage("");
        router.push(`/exhibitions`);
      }, 3000);
    }
  });


  const handleEditorChange = (event: any, editor: any) => {
    const data = editor.getData();
    setEditorContent(data); 
    // console.log("Editor content:", data);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let coverImageUrl = null;
    let coverImageFile = null;

    // Cover image logic
    if (coverImage && (exhibition && coverImage != exhibition.coverImageUrl)) {
      const coverImageToBlobResponse = await fetch(coverImage);
      coverImageFile = await coverImageToBlobResponse.blob();
    }

    if (coverImageFile) {
      const formData = new FormData();
      formData.append('file', coverImageFile);

      try {
        // Making a request
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        // Cloudinary response
        const result = await uploadResponse.json();
        if (result.url) {
          console.log("File uploaded successfully:", result.url);
          coverImageUrl = result.url;
        } else {
          console.error("No URL in the response.");
        }
        
      } catch (e) {
        console.error("Error during file upload:", e);
      }
    }

    updateExhibition.mutate({
      id: id,
      name: name,
      description: description,
      coverImageUrl: coverImageUrl || exhibition?.coverImageUrl,
      content: editorContent
    });
};
  

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (file.size > fileMaxSize) {
        setErrorMessage("The file size exceeds the maximum allowed size of 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setCoverImage(reader.result as string); 
          setSuccessMessage("New cover image uploaded successfully!");
          setErrorMessage(""); 
          setTimeout(() => setSuccessMessage(""), 3000);
        }
      };
      reader.readAsDataURL(file);
    };
  };

  const handleRemoveImage = () => {
    setCoverImage(exhibition?.coverImageUrl || ""); 
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; 
    }
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">Edit Exhibition {id}</h1>

      {successMessage && (
        <div className="bg-green-200 text-green-800 px-4 py-2 rounded-md mb-4">
          {successMessage}
        </div>
      )}


      {errorMessage && (
        <div className="bg-red-200 text-red-800 px-4 py-2 rounded-md mb-4">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>

      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error loading exhibitions.</div>
      ) : exhibition ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
          <label className="block text-l font-bold text-text-dark mb-1">Title</label>
            <input
              type="text"
              value={name || ""}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter exhibition title"
              className="w-full rounded-md border border-gray-300 focus:ring focus:ring-primary-dark focus:ring-opacity-90 px-4 py-2"
            />
            
            <br />

            <div>
              <label className="block text-l font-bold text-text-dark mb-1">Description</label>
              <textarea
                value={description ?? ""}
                onChange={(e) => {
                  if (e.target.value.length <= descriptionMaxLength) {
                    setDescription(e.target.value);
                  }
                }}
                placeholder="Enter exhibition description"
                className="w-full rounded-md border border-gray-300 focus:ring focus:ring-primary-dark focus:ring-opacity-50 px-4 py-2"
              />
              <p className="text-xs text-gray-500 mt-1">{description?.length ?? 0}/{descriptionMaxLength} characters</p>
            </div>

            <div>
              <label className="block text-l font-bold text-text-dark mb-1">Cover Image</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleCoverImageChange}
                  accept="image/*"
                  className="block w-full rounded-md shadow-sm bg-white font-medium text-sm border-gray-500 focus:ring-blue-600 focus:border-blue-600 mb-6"
                />
                {/*errorMessage && <p className="text-red-600 text-sm mt-1">{errorMessage}</p>*/}
              </div>

          </div>

          <div className="mt-8">
            <h2 className="block text-l font-bold text-text-dark mb-1">Uploaded Cover Image:</h2>
            {/* <CldImage
              src={exhibition.coverImageUrl}
              width="500"
              height="500"
              crop="fill"
              alt="Uploaded Image"
            /> */}
            <img src={coverImage || ""} width="300px" />

            {(coverImage != exhibition.coverImageUrl) &&(
                <span
                  onClick={handleRemoveImage}
                  className="text-black text-xs cursor-pointer hover:underline"
                  >
                  Restore Image
              </span>
            )}

          </div>

        </div>
      ) : (
        <p className="text-red-600">Could not load exhibition entry.</p>
      )}

        
      <br/>

      {/* CKEditor with adapter for Cloudinary */}

      <p className="text-xl font-semibold">Content editor</p>

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

      <button
        type="button"
        className="bg-gray-500 text-text-light px-4 py-2 rounded-md hover:bg-gray-600"
        onClick={() => router.push(`/exhibitions`)}
      >
        Cancel
      </button>
      
      <button
        type="submit"
        className="bg-accent text-text-light px-4 py-2 rounded-md hover:bg-primary-dark_hover disabled:pointer-events-none"
        disabled={updateExhibition.isPending || (exhibition && exhibition.name === name && exhibition.description === description && exhibition.coverImageUrl === coverImage && exhibition.content === editorContent)}
      >
        {updateExhibition.isPending ? "Saving..." : "Save Changes"}
      </button>

      </form>
    </div>
  );
};

export default ExhibitionEditorPage;