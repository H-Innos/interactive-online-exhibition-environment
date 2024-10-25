import React, { useEffect, useRef } from "react";
import type { Exhibition } from "../_types/exhibition";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { useMessage } from "~/context/message";

interface DashboardActionsModalProps {
  exhibition: Exhibition;
  onClose: () => void;
  position: { top: number; left: number };
}

const DashboardActionsModal: React.FC<DashboardActionsModalProps> = (
  { exhibition, onClose, position }) => {
    const router = useRouter();
    const utils = api.useUtils();
    const { setSuccessMessage, setErrorMessage } = useMessage();
    const modalRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
          onClose();
        }
      };
      
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [onClose]);
    
    const deleteExhibition = api.exhibition.delete.useMutation({
      onSuccess: async () => {
        await utils.exhibition.getAll.invalidate();
        setSuccessMessage("Exhibition deleted successfully!");
      },
      onError: (error) => {
        setErrorMessage(`Failed to delete exhibition: ${error.message}`);
      },
    });
    
    const publishExhibition = api.exhibition.publish.useMutation({
      onSuccess: async () => {
        await utils.exhibition.getAll.invalidate();
        setSuccessMessage("Exhibition published successfully!");
      },
      onError: (error) => {
        setErrorMessage(`Failed to publish exhibition: ${error.message}`);
      },
    });
    
    const unpublishExhibition = api.exhibition.unpublish.useMutation({
      onSuccess: async () => {
        await utils.exhibition.getAll.invalidate();
        setSuccessMessage("Exhibition moved back to drafts!");
      },
      onError: (error) => {
        setErrorMessage(`Failed to unpublish exhibition: ${error.message}`);
      },
    });
    
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
      <div
      ref={modalRef}
      className="absolute bg-white rounded-lg p-6 w-48 shadow-lg z-50 border border-gray-100"
      style={{ top: position.top, left: position.left }}
      >
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        style={{ fontSize: '1.7rem' }} 
      >
        &times;
      </button>
      <h2 className="text-xl font-semibold mb-4">Options</h2>
      <div className="space-y-2">
        <div
          onClick={handleChangePublishedState}
          className="cursor-pointer text-black hover:font-medium border-b border-gray-300 pb-2"
        >
          {exhibition.isPublished ? "Unpublish Exhibition" : "Publish Exhibition"}
        </div>
        <div
          onClick={handleOpenEditor}
          className="cursor-pointer text-black hover:font-medium border-b border-gray-300 pb-2"
        >
          Edit Exhibition
        </div>
        <div
          onClick={handleDeleteExhibition}
          className="cursor-pointer text-red-500 hover:font-medium"
        >
          Delete Exhibition
        </div>
      </div>
      </div>
    );
  };
  
  export default DashboardActionsModal;