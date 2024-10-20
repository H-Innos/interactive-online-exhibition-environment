"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import {ExhibitionCardConstants, ExhibitionList } from "~/app/_components/exhibition";
import type { Exhibition } from "../_types/exhibition";
import DashboardActionsModal from "../_components/dashboard-actions-modal";


const ExhibitionsPage = () => {
  const router = useRouter();
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [template, setTemplate] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedExhibitionId, setSelectedExhibitionId] = useState<number | null>(null);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);

  const TIMEOUT_DURATION = 3000;
  const defaultCoverImageUrl = "/logos/museum.jpg";
  const fileMaxSize = 5 * 1024 * 1024; // 5MB

  const exhibitionsPerPage = 24;
  const indexOfLastExhibition = currentPage * exhibitionsPerPage;
  const indexOfFirstExhibition = indexOfLastExhibition - exhibitionsPerPage;
  const currentExhibitions = exhibitions.slice(indexOfFirstExhibition, indexOfLastExhibition);
  const totalPages = Math.ceil(exhibitions.length / exhibitionsPerPage);

  const { data, error, isLoading } = api.exhibition.getAll.useQuery(undefined);
  const utils = api.useUtils();

  useEffect(() => {
    if (data) {
      setExhibitions(data);
    }
  }, [data]);

  const createExhibition = api.exhibition.create.useMutation({
    onSuccess: async () => {
      await utils.exhibition.invalidate();
      setName("");
      setDescription("");
      setTemplate("");
      setCoverImage("");
      setIsModalOpen(false);
      setSuccessMessage("Exhibition created successfully!");
      setErrorMessage("");
      setTimeout(() => setSuccessMessage(""), TIMEOUT_DURATION);
    },
    onError: (error) => {
      if (error.message === "An exhibition with this name already exists.") {
        setErrorMessage("An exhibition with this name already exists. Please choose a different name.");
      } else {
        setErrorMessage(`Failed to create exhibition: ${error.message}`);
      }
    },
  });

  const deleteExhibition = api.exhibition.delete.useMutation({
    onSuccess: async () => {
      await utils.exhibition.getAll.invalidate();
      setSuccessMessage("Exhibition deleted successfully!");
      setTimeout(() => setSuccessMessage(""), TIMEOUT_DURATION);
    },
    onError: (error) => {
      setErrorMessage(`Failed to delete exhibition: ${error.message}`);
      setTimeout(() => setErrorMessage(""), TIMEOUT_DURATION);
    },
  });

  const publishExhibition = api.exhibition.publish.useMutation({
    onSuccess: async () => {
      await utils.exhibition.getAll.invalidate();
      setSuccessMessage("Exhibition published successfully!");
      setTimeout(() => setSuccessMessage(""), TIMEOUT_DURATION);
    },
    onError: (error) => {
      setErrorMessage(`Failed to publish exhibition: ${error.message}`);
      setTimeout(() => setErrorMessage(""), TIMEOUT_DURATION);
    },
  });

  const unpublishExhibition = api.exhibition.unpublish.useMutation({
    onSuccess: async () => {
      await utils.exhibition.getAll.invalidate();
      setSuccessMessage("Exhibition moved back to drafts!");
      setTimeout(() => setSuccessMessage(""), TIMEOUT_DURATION);
    },
    onError: (error) => {
      setErrorMessage(`Failed to unpublish exhibition: ${error.message}`);
      setTimeout(() => setErrorMessage(""), TIMEOUT_DURATION);
    },
  });
  

  const handleOpenOptions = (id: number) => {
    setSelectedExhibitionId(id);
    setIsOptionsModalOpen(true);
  };

  const handleCloseOptions = () => {
    setSelectedExhibitionId(null);
    setIsOptionsModalOpen(false);
  };

  const handleDeleteExhibition = () => {
    if (selectedExhibitionId && window.confirm("Are you sure you want to delete this exhibition?")) {
      deleteExhibition.mutate({ id: selectedExhibitionId });
      handleCloseOptions();
    }
  };

  const handleEditExhibition = () => {
    if (selectedExhibitionId) {
      router.push(`/exhibitions/${selectedExhibitionId}`);
    }
  };

  const handlePublishExhibition = () => {
    if (selectedExhibitionId) {
      const exhibition = exhibitions.find(exh => exh.id === selectedExhibitionId);
  
      if (exhibition?.isPublished) {
        if (window.confirm("Are you sure you want to move this exhibition back to drafts?")) {
          unpublishExhibition.mutate({ id: selectedExhibitionId });
        }
      } else {
        if (window.confirm("Are you sure you want to publish this exhibition?")) {
          publishExhibition.mutate({ id: selectedExhibitionId });
        }
      }
  
      handleCloseOptions();
    }
  };
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrorMessage("Exhibition name is required.");
      return;
    }

    let coverImageUrl = null;
    let coverImageFile = null;

    if (coverImage) {
      const coverImageToBlobResponse = await fetch(coverImage);
      coverImageFile = await coverImageToBlobResponse.blob();
    }

    if (coverImageFile) {
      const formData = new FormData();
      formData.append('file', coverImageFile);

      try {
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const result = await uploadResponse.json();
        if (result.url) {
          coverImageUrl = result.url;
        }
        
      } catch (e) {
        console.error("Error during file upload:", e);
      }
    }

    createExhibition.mutate({
      name,
      description,
      coverImageUrl: coverImageUrl || defaultCoverImageUrl,
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
        }
      };
      reader.readAsDataURL(file);
    };
  };

  const handleRemoveImage = () => {
    setCoverImage(""); 
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; 
    }
  };

  const handleExhibitionClick = (id: number) => {
    router.push(`/exhibitions/${id}`);
  };

  return (
    <div className="text-text-dark min-h-screen pl-32 pr-12 py-8">
      <h1 className="text-3xl font-bold mb-2 text-accent">Dashboard</h1>
      <p className="text-lg mb-6 text-light-gray">Manage exhibitions</p>

      {successMessage && (
        <div className="bg-green-200 text-green-800 px-4 py-2 rounded-md mb-4">
          {successMessage}
        </div>
      )}

      <button
        onClick={() => {
          setIsModalOpen(true);
          setErrorMessage("");
        }}
        className="bg-primary-dark text-text-light px-4 py-2 rounded-md hover:bg-primary-dark_hover transition duration-300 mb-4"
      >
        New Exhibition
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-primary-light rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-2xl font-semibold mb-4 text-primary-dark">Create a New Exhibition</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1">Title</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter exhibition title"
                  className="w-full rounded-md border-gray-300 focus:border-primary-dark focus:ring focus:ring-primary-dark focus:ring-opacity-50 px-4 py-2"
                />
                {errorMessage && <p className="text-red-600 text-sm mt-1">{errorMessage}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1">Description</label>
                <textarea
                  value={description ?? ""}
                  onChange={(e) => {
                    if (e.target.value.length <= ExhibitionCardConstants.MAX_DESCRIPTION_LENGTH) {
                      setDescription(e.target.value);
                    }
                  }}
                  placeholder="Enter exhibition description"
                  className="w-full rounded-md border-gray-300 focus:border-primary-dark focus:ring focus:ring-primary-dark focus:ring-opacity-50 px-4 py-2"
                />
                <p className="text-xs text-gray-500 mt-1">{description?.length ?? 0}/{ExhibitionCardConstants.MAX_DESCRIPTION_LENGTH} characters</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1">Cover Image</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleCoverImageChange}
                  accept="image/*"
                  className="block w-full rounded-md shadow-sm bg-white font-medium text-sm border-gray-500 focus:ring-blue-600 focus:border-blue-600 mb-6"
                />
              </div>
              {coverImage && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Image Preview:</p>
                  <img src={coverImage} alt="Cover preview" className="w-32 h-32 object-cover mt-2" />
                  <span
                    onClick={handleRemoveImage}
                    className="text-black text-xs cursor-pointer hover:underline"
                  >
                    Discard
                  </span>
                </div>
              )}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {setIsModalOpen(false); handleRemoveImage();}}
                  className="bg-gray-500 text-text-light px-4 py-2 rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-accent text-text-light px-4 py-2 rounded-md hover:bg-primary-dark_hover"
                  disabled={createExhibition.isPending}
                >
                  {createExhibition.isPending ? "Saving..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error loading exhibitions.</div>
      ) : currentExhibitions && currentExhibitions.length > 0 ? (
        <div>
          <h1 className="text-2xl font-bold mb-2 text-accent">Drafts</h1>
          <ExhibitionList
            exhibitions={currentExhibitions.filter((exhibition) => !exhibition.isPublished)}
            onExhibitionClick={handleExhibitionClick}
            onOpenOptions={handleOpenOptions}
            onDelete={handleDeleteExhibition}
          />
          <h1 className="text-2xl font-bold mb-2 mt-10 text-accent">Published Exhibitions</h1>
          <ExhibitionList
            exhibitions={currentExhibitions.filter((exhibition) => exhibition.isPublished)}
            onExhibitionClick={handleExhibitionClick}
            onOpenOptions={handleOpenOptions}
            onDelete={handleDeleteExhibition}
          />
        </div>
      ) : (
        <p className="text-gray-500">No exhibitions available. Please add a new exhibition.</p>
      )}

      {isOptionsModalOpen && selectedExhibitionId !== null && (
        <DashboardActionsModal
          handlePublishExhibition={handlePublishExhibition}
          handleEditExhibition={handleEditExhibition}
          handleDeleteExhibition={handleDeleteExhibition}
          handleCloseOptions={handleCloseOptions}
          isPublished={exhibitions.find(exhibition => exhibition.id === selectedExhibitionId)?.isPublished ?? false}
        />
      )}


      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 space-x-4">
          <span
            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            className={`px-4 py-2 cursor-pointer text-xl ${
              currentPage === 1 ? 'text-gray-400 cursor-default' : 'text-gray-700 hover:text-black'
            }`}
          >
            ← Previous
          </span>

          <div className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <span
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-1 cursor-pointer ${
                  index + 1 === currentPage ? 'bg-black text-white rounded-md' : 'text-gray-700 hover:bg-gray-200 rounded-md'
                }`}
              >
                {index + 1}
              </span>
            ))}
          </div>

          <span
            onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
            className={`px-4 py-2 cursor-pointer text-xl ${
              currentPage === totalPages ? 'text-gray-400 cursor-default' : 'text-gray-700 hover:text-black'
            }`}
          >
            Next →
          </span>
        </div>
      )}
    </div>
  );
};

export default ExhibitionsPage;
