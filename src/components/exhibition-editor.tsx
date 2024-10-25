import React, { useEffect, useRef, useState } from 'react';
import ExhibitionContentEditor from './exhibition-content-editor';
import { configurations } from '~/constants/config';
import EditorPreview from './editor-preview';
import { usePublishExhibition } from '~/hooks/exhibition-actions';
import type { Exhibition } from '~/app/_types/exhibition';
import type { Editor } from '@ckeditor/ckeditor5-core';
import { useRouter } from 'next/navigation';
import type { EventInfo } from '@ckeditor/ckeditor5-utils';
import { api } from '~/trpc/react';
import { useMessage } from '~/context/message';

interface ExhibitionEditorProps {
    exhibition: Exhibition
}

const ExhibitionEditor: React.FC<ExhibitionEditorProps> = ({ exhibition }) => {
  const [ title, setTitle ] = useState(exhibition?.name ?? "");
  const [ description, setDescription ] = useState(exhibition?.description ?? "");
  const [ coverImage, setCoverImage ] = useState(exhibition?.coverImageUrl ?? "");
  const [ exhibitionContent, setExhibitionContent ] = useState(exhibition?.content ?? "");
  const [ unsavedChanges, setUnsavedChanges] = useState(false);
  
  const [ titleError, setTitleError] = useState("");

  const { setErrorMessage, setSuccessMessage } = useMessage();
  const router = useRouter();
  const utils = api.useUtils();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const publishExhibition = usePublishExhibition();
  
  const updateExhibition = api.exhibition.update.useMutation({
    onSuccess: async () => {
      await utils.exhibition.invalidate();
      setTitleError("");
    },
    onError: (error) => {
      if (error.message === "An exhibition with this name already exists.") {
        setTitleError("An exhibition with this name already exists. Please choose a different name.");
      } 
      else if (error.message.includes("String must contain at least 1 character(s)")) {
        setTitleError("Exhibition name must contain at least 1 character(s).");
      } 
      else {
        setTitleError(`Failed to create exhibition: ${error.message}`);
      }
    },
  });  

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


  const handleFormChanged = () =>  {
    setUnsavedChanges(true);
  }

  const handleRemoveImage = () => {
    setCoverImage(configurations.DEFAULT_COVER_IMAGE_URL);
    updateExhibition.mutate({
      id: exhibition.id,
      name: exhibition.name,
      coverImageUrl: configurations.DEFAULT_COVER_IMAGE_URL
    });
    setErrorMessage("");

    if (fileInputRef.current) {
      fileInputRef.current.value = ""; 
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (file.size > configurations.FILE_MAX_SIZE) {
        setErrorMessage(`The file size exceeds the maximum allowed size of ${configurations.FILE_MAX_SIZE / (1024 * 1024)}MB.`, false); 
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setCoverImage(reader.result as string)
          setSuccessMessage("New cover image uploaded successfully!");
          setErrorMessage("");
        }
        
      };
      reader.readAsDataURL(file);
    };
  };

  const handleCoverImageSave = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    let coverImageUrl = null;
    let coverImageFile = null;

    if (coverImage && coverImage != exhibition.coverImageUrl) {
      const coverImageToBlobResponse = await fetch(coverImage);
      coverImageFile = await coverImageToBlobResponse.blob();
    }

    if (!coverImageFile) {
      return;
    }

    const formData = new FormData();
    formData.append('file', coverImageFile);

    try {
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await uploadResponse.json();
      if (result.url) {
        console.log("File uploaded successfully:", result.url);
        coverImageUrl = result.url;
      } else {
        console.error("No URL in the response.");
      }
      updateExhibition.mutate({
        id: exhibition.id,
        name: exhibition.name,
        coverImageUrl: coverImageUrl,
      });      
    } catch (e) {
      console.error("Error during file upload:", e);
    }
  };

  const handleEditorChange = (event: EventInfo, editor: Editor) => {
    const data = editor.getData();
    setExhibitionContent(data);
  };

  const handleEditorBlur = (event: EventInfo, editor: Editor) => {
    updateExhibition.mutate({
      id: exhibition.id,
      name: exhibition.name,
      content: editor.getData()
    });
  };

  const handlePublish = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); 
    const confirmed = window.confirm("Are you sure you want to publish this exhibition?");
    
    if (confirmed) {
      publishExhibition.mutate({ id: Number(exhibition.id) });
    }
  };

  return (
    <div>
      <p>Status: {updateExhibition.isPending ? "Saving..." : "Saved"}</p> 
      <form onChange={handleFormChanged}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-l font-bold text-text-dark mb-1">Title</label>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={(e) => 
                  updateExhibition.mutate({
                    id: exhibition.id,
                    name: e.target.value,
                  })
                }
                placeholder="Enter exhibition title"
                className="w-full rounded-md border border-gray-300 focus:ring focus:ring-primary-dark focus:ring-opacity-90 px-4 py-2"
            />
            <p className="text-xs text-red-500 h-6">{titleError ?? ""}</p>
            
            <div>
              <label className="block text-l font-bold text-text-dark mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={(e) => 
                  updateExhibition.mutate({
                    id: exhibition.id,
                    name: exhibition.name,
                    description: e.target.value
                  })
                }
                placeholder="Enter exhibition description"
              className="w-full rounded-md border border-gray-300 focus:ring focus:ring-primary-dark focus:ring-opacity-50 px-4 py-2"
              />
              <p className="text-xs text-gray-500 mt-1">{exhibition.description?.length ?? 0}/{configurations.MAX_DESCRIPTION_LENGTH} characters</p>
            </div>
            <div>
              <label className="block text-l font-bold text-text-dark mb-1">Cover Image</label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleCoverImageChange}
                onBlur={handleCoverImageSave}
                accept="image/*"
                className="block w-full rounded-md shadow-sm bg-white font-medium text-sm border-gray-500 focus:ring-blue-600 focus:border-blue-600 mb-6"
              />
            </div>
              </div>
              

            <div className="mt-8">
            
            <div>
              <h2 className="block text-l font-bold text-text-dark mb-1">Uploaded Cover Image:</h2>
              <img 
                  src={coverImage ?? ""} 
                  alt="Cover image for exhibition entry." 
                  width="300px" 
                  style={{ maxHeight: "300px", objectFit: "contain" }}
              />
              <span
                onClick={handleRemoveImage}
                className="text-black text-xs cursor-pointer hover:underline"
                >
                Remove Image
              </span>
            </div>
            
          </div>
        </div>        
        <br/>

        <p className="text-xl font-semibold">Content editor</p>

        <ExhibitionContentEditor 
          initialContent={exhibition.content ?? ""} 
          onChange={handleEditorChange} 
          onBlur={handleEditorBlur}
        />

        <EditorPreview content={exhibition.content ?? ""} />

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
          disabled={true}
        >
          {updateExhibition.isPending ? "Saving..." : "Save Changes"}
        </button>

        <button
          type="submit"
          className="bg-lime-600 text-text-light mt-4 ml-4 px-3 py-2 rounded-md hover:bg-lime-500 disabled:pointer-events-none"
          disabled={updateExhibition.isPending || publishExhibition.isPending}
          onClick={handlePublish}
        >
          {publishExhibition.isPending ? "Publishing..." : "Publish"}
        </button>
      </form>
    </div>
  );
}

export default ExhibitionEditor;