"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import ExhibitionCard from "~/app/_components/exhibition";


export interface Exhibition {
  id: number;
  name: string | null;
  description: string | null;
  coverImageUrl: string | null;
  createdAt: Date | string;
  updatedAt: Date | null;
}

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

  const descriptionMaxLength = 130;

  // Pagination config
  const exhibitionsPerPage = 24;
  const indexOfLastExhibition = currentPage * exhibitionsPerPage;
  const indexOfFirstExhibition = indexOfLastExhibition - exhibitionsPerPage;
  const currentExhibitions = exhibitions.slice(indexOfFirstExhibition, indexOfLastExhibition);
  const totalPages = Math.ceil(exhibitions.length / exhibitionsPerPage);

  const { data, error, isLoading } = api.post.getAll.useQuery(undefined);
  const utils = api.useUtils();

  useEffect(() => {
    if (data) {
      setExhibitions(data);
    }
  }, [data]);

  const createExhibition = api.post.create.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate();
      setName("");
      setDescription("");
      setTemplate("");
      setCoverImage("");
      setIsModalOpen(false);
      setSuccessMessage("Exhibition created successfully!");
      setErrorMessage("");
      setTimeout(() => setSuccessMessage(""), 3000);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrorMessage("Exhibition name is required.");
      return;
    }

    const defaultCoverImageUrl = "/logos/museum.jpg";
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

    createExhibition.mutate({
      name,
      description,
      coverImageUrl: coverImageUrl || defaultCoverImageUrl,
    });
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          // NB!    data:image/*;base64,
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



  // Navigate to exhibition editor page when an exhibition is clicked
  const handleExhibitionClick = (id: number) => {
    router.push(`/exhibitions/${id}`);
  };

  return (
    <div className="text-text-dark min-h-screen pl-32 pr-12 py-8">
      <h1 className="text-3xl font-bold mb-2 text-accent">All Exhibitions</h1>
      <p className="text-lg mb-6 text-light-gray">Manage</p>

      {/* Display message if exhibition was successfully created */}
      {successMessage && (
        <div className="bg-green-200 text-green-800 px-4 py-2 rounded-md mb-4">
          {successMessage}
        </div>
      )}

      {/* Open the creator for creating a new exhibition */}
      <button
        onClick={() => {
          setIsModalOpen(true);
          setErrorMessage("");
        }}
        className="bg-primary-dark text-text-light px-4 py-2 rounded-md hover:bg-primary-dark_hover transition duration-300 mb-4"
      >
        New Exhibition
      </button>

      {/* Creating a new exhibition */}
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
                {/* Error message if name is not filled in */}
                {errorMessage && <p className="text-red-600 text-sm mt-1">{errorMessage}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1">Description</label>
                <textarea
                  value={description ?? ""}
                  onChange={(e) => {
                    if (e.target.value.length <= descriptionMaxLength) {
                      setDescription(e.target.value);
                    }
                  }}
                  placeholder="Enter exhibition description"
                  className="w-full rounded-md border-gray-300 focus:border-primary-dark focus:ring focus:ring-primary-dark focus:ring-opacity-50 px-4 py-2"
                />
                <p className="text-xs text-gray-500 mt-1">{description?.length ?? 0}/{descriptionMaxLength} characters</p>
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
                        onClick={handleRemoveImage} // Reset the coverImage state
                        className="text-black text-xs cursor-pointer hover:underline"
                      >
                      Discard
                    </span>
                  </div>
                )}
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1">Template</label>
                <select
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  className="w-full rounded-md border-gray-300 focus:border-primary-dark focus:ring focus:ring-primary-dark focus:ring-opacity-50 px-4 py-2"
                >
                  <option value="">Select a template</option>
                  <option value="template1">Template 1</option>
                  <option value="template2">Template 2</option>
                  <option value="template3">Template 3</option>
                </select>
              </div>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {currentExhibitions.map((exhibition) => (
            <ExhibitionCard
              key={exhibition.id}
              exhibition={exhibition}
              descriptionMaxLength={descriptionMaxLength}
              onClick={handleExhibitionClick}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No exhibitions available. Please add a new exhibition.</p>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 space-x-4">
          {/* Previous text, styled as lighter gray when disabled */}
          <span
            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            className={`px-4 py-2 cursor-pointer text-xl ${
              currentPage === 1 ? 'text-gray-400 cursor-default' : 'text-gray-700 hover:text-black'
            }`}
          >
            ← Previous
          </span>

          {/* Page indicator boxes */}
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
