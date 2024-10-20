"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import {ExhibitionList } from "~/app/_components/exhibition";
import type { Exhibition } from "../_types/exhibition";
import DashboardActionsModal from "../_components/dashboard-actions-modal";
import { configurations } from "~/constants/config";
import PaginationControls from "../../components/pagination-controls";
import CreateExhibitionModal from "../_components/create-exhibition-modal";


const ExhibitionsPage = ({
  searchParams }: {
    searchParams: Record<string, string | string[] | undefined>;
  }) => {
  const router = useRouter();
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [isCreateExhibitionModalOpen, setIsCreateExhibitionModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedExhibitionId, setSelectedExhibitionId] = useState<number | null>(null);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);

  let currentPage = Number(searchParams.page);
  const totalPages = Math.ceil(exhibitions.length / configurations.EXHIBITIONS_PER_PAGE);

  if (isNaN(currentPage) || currentPage < 1 || currentPage > totalPages) {
    currentPage = 1;
  }
  const indexOfLastExhibition = currentPage * configurations.EXHIBITIONS_PER_PAGE;
  const indexOfFirstExhibition = indexOfLastExhibition - configurations.EXHIBITIONS_PER_PAGE;
  const currentExhibitions = exhibitions.slice(indexOfFirstExhibition, indexOfLastExhibition);


  const { data, error, isLoading } = api.exhibition.getAll.useQuery(undefined);
  const utils = api.useUtils();

  useEffect(() => {
    if (data) {
      setExhibitions(data);
    }
  }, [data]);

  const deleteExhibition = api.exhibition.delete.useMutation({
    onSuccess: async () => {
      await utils.exhibition.getAll.invalidate();
      setSuccessMessage("Exhibition deleted successfully!");
      setTimeout(() => setSuccessMessage(""), configurations.TIMEOUT_DURATION);
    },
    onError: (error) => {
      setErrorMessage(`Failed to delete exhibition: ${error.message}`);
      setTimeout(() => setErrorMessage(""), configurations.TIMEOUT_DURATION);
    },
  });

  const publishExhibition = api.exhibition.publish.useMutation({
    onSuccess: async () => {
      await utils.exhibition.getAll.invalidate();
      setSuccessMessage("Exhibition published successfully!");
      setTimeout(() => setSuccessMessage(""), configurations.TIMEOUT_DURATION);
    },
    onError: (error) => {
      setErrorMessage(`Failed to publish exhibition: ${error.message}`);
      setTimeout(() => setErrorMessage(""), configurations.TIMEOUT_DURATION);
    },
  });

  const unpublishExhibition = api.exhibition.unpublish.useMutation({
    onSuccess: async () => {
      await utils.exhibition.getAll.invalidate();
      setSuccessMessage("Exhibition moved back to drafts!");
      setTimeout(() => setSuccessMessage(""), configurations.TIMEOUT_DURATION);
    },
    onError: (error) => {
      setErrorMessage(`Failed to unpublish exhibition: ${error.message}`);
      setTimeout(() => setErrorMessage(""), configurations.TIMEOUT_DURATION);
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
          setIsCreateExhibitionModalOpen(true);
          setErrorMessage("");
        }}
        className="bg-primary-dark text-text-light px-4 py-2 rounded-md hover:bg-primary-dark_hover transition duration-300 mb-4"
      >
        New Exhibition
      </button>

      {isCreateExhibitionModalOpen && <CreateExhibitionModal onClose={() => setIsCreateExhibitionModalOpen(false)}/>}
      
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

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </div>
  );
};

export default ExhibitionsPage;
