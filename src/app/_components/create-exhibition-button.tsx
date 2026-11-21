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
        className="mb-4 rounded-md bg-primary-dark px-4 py-2 text-text-light transition duration-300 hover:bg-primary-dark_hover"
        data-testid="new-exhibition-button"
      >
        {buttonText ?? t("createExhibition.newExhibition")}
      </button>

      {isModalOpen && <CreateExhibitionModal onClose={closeModal} />}
    </>
  );
};

export default CreateExhibitionButton;
