import React from "react";

interface DashboardActionsModalProps {
  handlePublishExhibition: () => void;
  handleEditExhibition: () => void;
  handleDeleteExhibition: () => void;
  handleCloseOptions: () => void;
  isPublished: boolean;
}

export default function DashboardActionsModal(
  { handlePublishExhibition, handleEditExhibition, handleDeleteExhibition, handleCloseOptions, isPublished }
  : DashboardActionsModalProps) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-sm">
          <h2 className="text-2xl font-semibold mb-4">Exhibition Options</h2>
          <div className="space-y-4">
            <button
              onClick={handlePublishExhibition} 
              className="w-full bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600 transition duration-300"
            >
              {isPublished ? "Unpublish Exhibition" : "Publish Exhibition"}
            </button>
            <button
              onClick={handleEditExhibition}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
            >
              Edit Exhibition
            </button>
            <button
              onClick={handleDeleteExhibition}
              className="w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
            >
              Delete Exhibition
            </button>
            <button
              onClick={handleCloseOptions}
              className="w-full bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
}
