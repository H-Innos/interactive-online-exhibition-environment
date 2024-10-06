"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

const ExhibitionsPage = () => {
  const [posts] = api.post.getAll.useSuspenseQuery();
  const utils = api.useUtils();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [template, setTemplate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(file); 
      };
      reader.readAsDataURL(file);
    }
  };

  //  stores the image as a base64 string
  const convertFileToBase64 = (file: File | null): Promise<string | null> => {
    if (!file) return Promise.resolve(null);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // mutation to add a new post
  const createPost = api.post.create.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate(); 
      setName("");
      setDescription("");
      setCoverImage(null);
      setTemplate("");
      setIsModalOpen(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const coverImageUrl = await convertFileToBase64(coverImage);
    createPost.mutate({
      name,
      description,
      coverImageUrl: coverImageUrl || '', 
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">All Exhibitions</h1>
      <p className="text-lg mb-6">Manage:</p>

      {/* Button to open the creator */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 mb-4"
      >
        Create a New Exhibition
      </button>

      {/*creating a new exhibition */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <h2 className="text-2xl font-semibold mb-4">Create a New Exhibition</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter exhibition title"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter exhibition description"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                  className="w-full border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Template
                </label>
                <select
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  disabled={createPost.isPending}
                >
                  {createPost.isPending ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* displays list of posts in a grid */}
      {posts && posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post.id} className="flex bg-white rounded-md shadow-md overflow-hidden">
              <div className="w-1/3 h-32 bg-gray-200">
                <img
                  src={post.coverImageUrl || "/placeholder.jpg"}
                  alt={post.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-2/3 p-4">
                <h2 className="text-lg font-semibold">{post.name}</h2>
                <p className="text-sm text-gray-500">{post.description}</p>
                <p className="text-xs text-gray-400">Created at: {new Date(post.createdAt).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No exhibitions available. Please add a new exhibition.</p>
      )}
    </div>
  );
};

export default ExhibitionsPage;
