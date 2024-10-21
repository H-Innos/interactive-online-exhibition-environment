import React from "react";
import type { Exhibition } from "../_types/exhibition";
import { useRouter } from "next/navigation";
import { useExhibitionActions } from "~/hooks/exhibition-actions";


interface DashboardActionsModalProps {
  exhibition: Exhibition;
  onClose: () => void;
}

const DashboardActionsModal: React.FC<DashboardActionsModalProps> = (
  { exhibition, onClose }) => {
  const router = useRouter();
  const { deleteExhibition, publishExhibition, unpublishExhibition } = useExhibitionActions();

  const handleDeleteExhibition = () => {
    if (exhibition.id && window.confirm("Are you sure you want to delete this exhibition?")) {
      deleteExhibition.mutate({ id: exhibition.id });
      onClose();
    }
  };

  const handleOpenEditor = () => {
    if (exhibition.id) {
      router.push(`/exhibitions/${exhibition.id}`);
    }
  };

  const handleChangePublishedState = () => {
    if (exhibition.id) { 
      if (exhibition?.isPublished) {
        if (window.confirm("Are you sure you want to move this exhibition back to drafts?")) {
          unpublishExhibition.mutate({ id: exhibition.id });
        }
      } else {
        if (window.confirm("Are you sure you want to publish this exhibition?")) {
          publishExhibition.mutate({ id: exhibition.id });
        }
      }
      onClose();
    }
  };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-sm">
          <h2 className="text-2xl font-semibold mb-4">Exhibition Options</h2>
          <div className="space-y-4">
            <button
              onClick={handleChangePublishedState} 
              className="w-full bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600 transition duration-300"
            >
              {exhibition.isPublished ? "Unpublish Exhibition" : "Publish Exhibition"}
            </button>
            <button
              onClick={handleOpenEditor}
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
              onClick={() => onClose()}
              className="w-full bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
}

export default DashboardActionsModal;