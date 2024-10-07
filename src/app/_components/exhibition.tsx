"use client";

import { useRouter } from 'next/navigation'; 
import { useState } from "react";
import { api } from "~/trpc/react";

export function LatestExhibition() {
  const router = useRouter(); 
  const [latestExhibition] = api.post.getLatest.useSuspenseQuery(); 
  const utils = api.useUtils();
  const [name, setName] = useState("");

  const createExhibition = api.post.create.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate(); 
      setName("");
    },
  });

  // handles navigation to the editor page
  const handleExhibitionClick = (id: number) => {
    void router.push(`/exhibitions/${id}`); 
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg p-6 flex items-start space-x-6">
      <div
        className="w-32 h-42 bg-gray-200 flex items-center justify-center rounded-lg cursor-pointer"
        onClick={() => latestExhibition && handleExhibitionClick(latestExhibition.id)} 
      >
        {latestExhibition?.coverImageUrl ? (
          <img
            src={latestExhibition.coverImageUrl}
            alt={latestExhibition.name ?? "No title available"}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <svg
            className="w-16 h-16 text-gray-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              d="M2 5a2 2 0 012-2h16a2 2 0 012 2v14a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm4.25 3a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5zM12 12l2.5-3 3.5 4.5H6l2-2.5 2 2.5z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>

      <div className="flex-grow w-2/3">
        {latestExhibition ? (
          <>
            <h2
              className="text-xl font-semibold text-primary-dark mb-2 whitespace-normal break-words overflow-wrap cursor-pointer"
              onClick={() => handleExhibitionClick(latestExhibition.id)} 
            >
              {latestExhibition.name ?? "No title available"}
            </h2>
            <p className="text-sm text-gray-600 mb-1 whitespace-normal break-words overflow-wrap">
              {latestExhibition.description ?? "No description available."}
            </p>
            <p className="text-xs text-gray-400">
              Created at: {new Date(latestExhibition.createdAt).toLocaleString()}
            </p>
          </>
        ) : (
          <p className="text-gray-600">You have no exhibitions yet.</p>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          createExhibition.mutate({ name }); 
        }}
        className="flex flex-col gap-2 w-1/3"
      >
        <input
          type="text"
          placeholder="New Exhibition Title"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg px-4 py-2 text-black border border-gray-300 focus:border-primary-dark focus:ring focus:ring-primary-dark focus:ring-opacity-50"
        />
        <button
          type="submit"
          className="rounded-lg bg-primary-dark text-white px-4 py-2 font-semibold transition hover:bg-primary-dark_hover"
          disabled={createExhibition.isPending}
        >
          {createExhibition.isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
