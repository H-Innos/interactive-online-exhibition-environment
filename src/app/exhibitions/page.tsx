"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation for App Router
import { api } from "~/trpc/react";

interface Exhibition {
  id: number;
  name: string | null;
  description: string | null;
  coverImageUrl: string | null;
  createdAt: Date | string;
  updatedAt: Date | null;
}

const ExhibitionsPage = () => {
  const router = useRouter(); // Initialize the router from next/navigation
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
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
      setIsModalOpen(false);
      setSuccessMessage("Exhibition created successfully!");
      setErrorMessage("");
      setTimeout(() => setSuccessMessage(""), 3000);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrorMessage("Exhibition name is required.");
      return;
    }

    const defaultCoverImageUrl = "/logos/museum.jpg";
    createExhibition.mutate({
      name,
      description,
      coverImageUrl: defaultCoverImageUrl,
    });
  };

  // Navigate to exhibition editor page when an exhibition is clicked
  const handleExhibitionClick = (id: number) => {
    router.push(`/exhibitions/${id}`); // Use router.push to navigate to the exhibition page with the given ID
  };

  // Shortens the description if it's too long
  const truncateDescription = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  // Utility function to format the date to a consistent string format
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleString("en-gb", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Etc/GMT-3",
    });
  };

  return (
    <div className="text-text-dark min-h-screen pl-32 pr-12 py-8">
      <h1 className="text-3xl font-bold mb-2 text-primary-dark">All Exhibitions</h1>
      <p className="text-lg mb-6 text-light-gray">Manage</p>

      {/* Display success message if exhibition was successfully created */}
      {successMessage && (
        <div className="bg-green-200 text-green-800 px-4 py-2 rounded-md mb-4">
          {successMessage}
        </div>
      )}

      {/* Open the creator for creating a new exhibition */}
      <button
        onClick={() => {
          setIsModalOpen(true);
          setErrorMessage(""); // Reset error message when opening the modal
        }}
        className="bg-accent text-text-light px-4 py-2 rounded-md hover:bg-primary-dark_hover transition duration-300 mb-4"
      >
        Create a New Exhibition
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
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-text-light px-4 py-2 rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-accent text-text-light px-4 py-2 rounded-md hover:bg-primary-dark_hover"
                  disabled={createExhibition.isPending}
                >
                  {createExhibition.isPending ? "Saving..." : "Publish"}
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
            <div
              key={exhibition.id}
              className="flex bg-primary-light rounded-lg overflow-hidden p-4 h-48 w-full md:w-[400px] cursor-pointer" // Make the card clickable
              onClick={() => handleExhibitionClick(exhibition.id)} // Navigate to the editor page on click
            >
              <div className="w-1/3 bg-gray-200 rounded-md overflow-hidden flex items-center justify-center">
                <img
                  src={exhibition.coverImageUrl ?? "/logos/museum.jpg"}
                  alt={exhibition.name ?? "Exhibition"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-2/3 pl-4">
                <h2 className="text-lg font-semibold text-primary-dark">{exhibition.name}</h2>
                <p className="text-sm text-text-dark overflow-wrap break-words whitespace-normal">
                  {truncateDescription(exhibition.description ?? "", descriptionMaxLength)}
                </p>
                <p className="text-xs text-text-dark mt-2">
                  Created: {formatDate(exhibition.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No exhibitions available. Please add a new exhibition.</p>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 space-x-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 disabled:bg-gray-200"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-lg">Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 disabled:bg-gray-200"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ExhibitionsPage;
