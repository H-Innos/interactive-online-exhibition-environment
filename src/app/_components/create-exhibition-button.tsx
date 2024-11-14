"use client";

import React, { useState } from "react";
import CreateExhibitionModal from "../_components/create-exhibition-modal";
import { useTranslation } from "react-i18next";

interface CreateExhibitionButtonProps {
  buttonText?: string;
}

const CreateExhibitionButton: React.FC<CreateExhibitionButtonProps> = ({
  buttonText,
}) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <button
        onClick={openModal}
        className="bg-primary-dark text-text-light px-4 py-2 rounded-md hover:bg-primary-dark_hover transition duration-300 mb-4"
      >
        {buttonText ?? t('createExhibition.newExhibition')}
      </button>

      {isModalOpen && <CreateExhibitionModal onClose={closeModal} />}
    </>
  );
};

export default CreateExhibitionButton;