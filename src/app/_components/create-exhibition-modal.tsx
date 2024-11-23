"use client";

import React, { useRef, useState } from "react";
import { configurations } from "~/lib/constants/config";
import { uploadImage } from "~/lib/utils/image-uploader";
import { useCreateExhibition } from "~/hooks/exhibition-actions";
import { useTranslation } from "react-i18next";
import RemovableImage from "~/components/removable-image";
import { cn } from "~/lib/utils";

interface CreateExhibitionModalProps {
  onClose: () => void;
}

const CreateExhibitionModal: React.FC<CreateExhibitionModalProps> = ({
  onClose,
}) => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const createExhibition = useCreateExhibition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrorMessage(t("createExhibition.nameRequired"));
      return;
    }

    let coverImageUrl = configurations.DEFAULT_COVER_IMAGE_URL;

    if (coverImage) {
      coverImageUrl =
        (await uploadImage(coverImage)) ??
        configurations.DEFAULT_COVER_IMAGE_URL;
    }

    await createExhibition.mutateAsync({
      name,
      description,
      coverImageUrl,
    });

    onClose();
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (file.size > configurations.MAX_FILE_SIZE_BYTES) {
        setErrorMessage(
          t("createExhibition.fileSizeExceeds", {
            maxSize: configurations.MAX_FILE_SIZE_BYTES / (1024 * 1024),
          }),
        );
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setCoverImage(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setCoverImage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      data-testid="create-exhibition-modal"
    >
      <div className="w-full max-w-lg rounded-lg bg-primary-light p-6">
        <h2 className="mb-4 text-2xl font-semibold text-primary-dark">
          {t("createExhibition.title")}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-text-dark">
              {t("createExhibition.nameLabel")}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("createExhibition.namePlaceholder")}
              className={cn("w-full rounded-md border-gray-300 px-4 py-2", {
                "focus:border-primary-dark focus:ring focus:ring-primary-dark focus:ring-opacity-50":
                  !errorMessage,
                "border-red-600": errorMessage,
              })}
            />
            {errorMessage && (
              <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-text-dark">
              {t("createExhibition.descriptionLabel")}
            </label>
            <textarea
              value={description ?? ""}
              onChange={(e) => {
                if (
                  e.target.value.length <= configurations.MAX_DESCRIPTION_LENGTH
                ) {
                  setDescription(e.target.value);
                }
              }}
              placeholder={t("createExhibition.descriptionPlaceholder")}
              className="w-full rounded-md border-gray-300 px-4 py-2 focus:border-primary-dark focus:ring focus:ring-primary-dark focus:ring-opacity-50"
            />
            <p className="mt-1 text-xs text-gray-500">
              {description?.length ?? 0}/{configurations.MAX_DESCRIPTION_LENGTH}{" "}
              characters
            </p>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-text-dark">
              {t("createExhibition.coverImageLabel")}
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleCoverImageChange}
              accept="image/*"
              className="mb-6 block w-full rounded-md border-gray-500 bg-white text-sm font-medium shadow-sm focus:border-blue-600 focus:ring-blue-600"
            />
          </div>
          {coverImage && (
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                {t("createExhibition.imagePreview")}
              </p>
              <RemovableImage
                src={coverImage}
                alt="Cover preview"
                className="h-32 w-32"
                onDelete={handleRemoveImage}
              />
            </div>
          )}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                onClose();
                handleRemoveImage();
              }}
              className="rounded-md bg-gray-500 px-4 py-2 text-text-light hover:bg-gray-600"
            >
              {t("createExhibition.cancel")}
            </button>
            <button
              type="submit"
              data-testid="create-exhibition-button"
              className="rounded-md bg-primary px-4 py-2 text-text-light hover:bg-primary-dark_hover"
              disabled={createExhibition.isPending}
            >
              {createExhibition.isPending
                ? t("createExhibition.saving")
                : t("createExhibition.create")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateExhibitionModal;
