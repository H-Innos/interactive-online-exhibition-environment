"use client";

import { useState } from "react";
import { api } from "~/trpc/react"; 

const ExhibitionsPage = () => {
  const [posts] = api.post.getAll.useSuspenseQuery();
  const utils = api.useUtils();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [template, setTemplate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const descriptionMaxLength = 170;

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 12;

  const createPost = api.post.create.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate();
      setName("");
      setDescription("");
      setTemplate("");
      setIsModalOpen(false); 
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const defaultCoverImageUrl = "/logos/museum.jpg";
    createPost.mutate({
      name,
      description,
      coverImageUrl: defaultCoverImageUrl,
    });
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // total number of pages
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const truncateDescription = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  return (
    <div className="text-text-dark min-h-screen pl-32 pr-12 py-8">
      <h1 className="text-3xl font-bold mb-2 text-primary-dark">All Exhibitions</h1>
      <p className="text-lg mb-6 text-light-gray">Manage</p>

      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-accent text-text-light px-4 py-2 rounded-md hover:bg-primary-dark_hover transition duration-300 mb-4"
      >
        Create a New Exhibition
      </button>

      {/* creating a new exhibition */}
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
              </div>
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1">Description</label>
                <textarea
                  value={description ?? ""} 
                  onChange={(e) => {
                    // limit input to 170 characters
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
                  disabled={createPost.isPending}
                >
                  {createPost.isPending ? "Saving..." : "Publish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {currentPosts && currentPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {currentPosts.map((post) => (
            <div key={post.id} className="flex bg-primary-light rounded-lg overflow-hidden p-4 h-48 w-full md:w-[400px]">
              <div className="w-1/3 bg-gray-200 rounded-md overflow-hidden flex items-center justify-center">
                <img
                  src={post.coverImageUrl ?? "/logos/museum.jpg"} 
                  alt={post.name ?? "Exhibition"} 
                  className="w-full h-full object-cover"
                />
              </div>
              {/*post content */}
              <div className="w-2/3 pl-4">
                <h2 className="text-lg font-semibold text-primary-dark">{post.name}</h2>
                <p className="text-sm text-text-dark overflow-wrap break-words whitespace-normal">
                  {truncateDescription(post.description ?? "", descriptionMaxLength)} {/* Ensure description is a string */}
                </p>
                <p className="text-xs text-text-dark mt-2">Created: {new Date(post.createdAt).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No exhibitions available. Please add a new exhibition.</p>
      )}

      {/* page controls */}
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
