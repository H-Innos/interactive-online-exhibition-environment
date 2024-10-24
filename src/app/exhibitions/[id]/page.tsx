"use client";

import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState, useRef } from 'react';
import { api } from "~/trpc/react";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import type { Editor } from '@ckeditor/ckeditor5-core';
//import { EventInfo } from '@ckeditor/ckeditor5-utils/src/eventinfo';
import type { FileLoader, UploadResponse } from '@ckeditor/ckeditor5-upload/src/filerepository';

import type { Exhibition } from '~/app/_types/exhibition';
import MessageBanner from '~/app/_components/message-banner';
import { useMessage } from '~/context/message';
import { configurations } from '~/constants/config';

// custom upload adapter for CKEditor to handle Cloudinary uploads
class Uploader {
  loader: FileLoader;
  constructor(loader: FileLoader) {
    this.loader = loader; // assigns the loader
  }

  upload() {
    console.log("Attempting to upload the file...");
    return this.loader.file
      .then((file: File | null) => {
        if (!file) {
          console.error("No file found.");
          throw new Error('File is not available.');
        }

        console.log("File found:", file);

        return new Promise<UploadResponse>((resolve, reject) => {
          const formData = new FormData();
          formData.append('file', file as File);

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
                reject(new Error('No URL in the response'));
              }
            })
            .catch((error: Error) => {
              console.error("Error during file upload:", error);
              reject(error);
            });
        });
      })
      .catch((error: Error) => {
        console.error('Upload failed:', error);
        return Promise.reject(error);
      });
  }
}

// plugin for CKEditor to use uploader for Cloudinary uploads
function UploaderPlugin(editor: Editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader: FileLoader) => {
    return new Uploader(loader);
  };
}

// exhibition editor component
const ExhibitionEditorPage = () => {
  const router = useRouter();
  const { id } = useParams() as { id: string };

  const [exhibition, setExhibition] = useState<Exhibition | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);

  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const [editorContent, setEditorContent] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const utils = api.useUtils();

  const { setSuccessMessage, setErrorMessage } = useMessage(); 
  const { data, error, isLoading } = api.exhibition.getOne.useQuery({ id: id });

  useEffect(() => {
    if (data) {
      setExhibition(data);
      setName(data.name ?? "");
      setDescription(data.description ?? "");
      setCoverImage(data.coverImageUrl ?? "");
      setEditorContent(data.content ?? "");
    }
  }, [data]);

  useEffect(() => {
    if (!unsavedChanges) return;
    
    function handleBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      return (event.returnValue = '');
    };
    window.addEventListener('beforeunload', handleBeforeUnload, {capture: true});
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload, {capture: true});
    }
  }, [unsavedChanges]);

  const updateExhibition = api.exhibition.update.useMutation({
    onSuccess: async () => {
      await utils.exhibition.invalidate();
      setSuccessMessage("Exhibition updated successfully!");
    },
    onError: (error) => {
      if (error.message === "An exhibition with this name already exists.") {
        setErrorMessage("An exhibition with this name already exists. Please choose a different name.");
      } 
      else if (error.message.includes("String must contain at least 1 character(s)")) {
        setErrorMessage("Exhibition name must contain at least 1 character(s).");
      } 
      else {
        setErrorMessage(`Failed to create exhibition: ${error.message}`);
      }
    },
  });

  const publishExhibition = api.exhibition.publish.useMutation({
    onSuccess: async () => {
      await utils.exhibition.invalidate();
      setSuccessMessage("Exhibition published successfully!");
      router.push(`/exhibitions`);
    },
    onError: (error) => {
      setErrorMessage(error.message);
    }
  });

  const handleEditorChange = (event: any, editor: Editor) => {
    const data = editor.getData();
    setEditorContent(data); 
    setUnsavedChanges(true);
    // console.log("Editor content:", data);
  };

  const handlePublish = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); 
      const confirmed = window.confirm("Are you sure you want to publish this exhibition?");
    
    if (confirmed) {
      await handleSaveChanges(e);
      publishExhibition.mutate({ id: Number(id) });
    }
  };
  
  const handleSaveChanges = async (e: React.MouseEvent<HTMLButtonElement>) => {
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
      if (file.size > configurations.FILE_MAX_SIZE) {
        setErrorMessage("The file size exceeds the maximum allowed size of 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setCoverImage(reader.result as string); 
          setSuccessMessage("New cover image uploaded successfully!");
        }
      };
      reader.readAsDataURL(file);
    };
  };

  const handleRemoveImage = () => {
    setCoverImage(exhibition?.coverImageUrl ?? ""); 
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; 
    }
  };

  const handleFormChanged = () => {
    setUnsavedChanges(true);
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">Edit Exhibition {id}</h1>

      <MessageBanner />

      <form onChange={handleFormChanged}>

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
                  if (e.target.value.length <= configurations.MAX_DESCRIPTION_LENGTH) {
                    setDescription(e.target.value);
                  }
                }}
                placeholder="Enter exhibition description"
                className="w-full rounded-md border border-gray-300 focus:ring focus:ring-primary-dark focus:ring-opacity-50 px-4 py-2"
              />
              <p className="text-xs text-gray-500 mt-1">{description?.length ?? 0}/{configurations.MAX_DESCRIPTION_LENGTH} characters</p>
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
              </div>

          </div>

          <div className="mt-8">
            <h2 className="block text-l font-bold text-text-dark mb-1">Uploaded Cover Image:</h2>
            <img 
              src={coverImage ?? ""} 
              alt="Cover image for exhibition entry." 
              width="300px" 
              style={{ maxHeight: "300px", objectFit: "contain" }}
            />
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
        className="bg-gray-500 text-text-light mt-4 px-4 py-2 rounded-md hover:bg-gray-600"
        onClick={() => router.push(`/exhibitions`)}
      >
        Exit
      </button>
      
      <button
        type="submit"
        className="bg-accent text-text-light mt-4 ml-4 px-3 py-2 rounded-md hover:bg-primary-dark_hover disabled:pointer-events-none"
        disabled={updateExhibition.isPending}
        onClick={handleSaveChanges}
      >
        {updateExhibition.isPending ? "Saving..." : "Save Changes"}
      </button>

      <button
        type="submit"
        className="bg-lime-600 text-text-light mt-4 ml-4 px-3 py-2 rounded-md hover:bg-lime-500 disabled:pointer-events-none"
        disabled={publishExhibition.isPending}
        onClick={handlePublish}
      >
        {publishExhibition.isPending ? "Publishing..." : "Publish"}
      </button>

      </form>
    </div>
  );
};

export default ExhibitionEditorPage;