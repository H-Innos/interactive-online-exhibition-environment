'use client';

import Image from "next/image";
import React, { useRef, useState } from "react";
import { configurations } from "~/lib/constants/config";
import { uploadImage } from '~/lib/utils/image-uploader';
import { useCreateExhibition } from "~/hooks/exhibition-actions";
import { useTranslation } from 'react-i18next';
import ExhibitionThumbnail from '~/components/removable-image';
import cn from 'classnames';

interface CreateExhibitionModalProps {
  onClose: () => void;
}

const CreateExhibitionModal: React.FC<CreateExhibitionModalProps> = ({ onClose }) => {
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
      setErrorMessage(t('createExhibition.nameRequired'));
      return;
    }

    let coverImageUrl = configurations.DEFAULT_COVER_IMAGE_URL;

    if (coverImage) {
      coverImageUrl = (await uploadImage(coverImage)) ?? configurations.DEFAULT_COVER_IMAGE_URL;
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
        setErrorMessage(t('createExhibition.fileSizeExceeds', { maxSize: configurations.MAX_FILE_SIZE_BYTES / (1024 * 1024) }));
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-primary-light rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-4 text-primary-dark">{t('createExhibition.title')}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-dark mb-1">{t('createExhibition.nameLabel')}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('createExhibition.namePlaceholder')}
              className={cn("w-full rounded-md border-gray-300 px-4 py-2", {
                "focus:border-primary-dark focus:ring focus:ring-primary-dark focus:ring-opacity-50": !errorMessage,
                "border-red-600": errorMessage,
              })}
            />
            {errorMessage && <p className="text-red-600 text-sm mt-1">{errorMessage}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-text-dark mb-1">{t('createExhibition.descriptionLabel')}</label>
            <textarea
              value={description ?? ""}
              onChange={(e) => {
                if (e.target.value.length <= configurations.MAX_DESCRIPTION_LENGTH) {
                  setDescription(e.target.value);
                }
              }}
              placeholder={t('createExhibition.descriptionPlaceholder')}
              className="w-full rounded-md border-gray-300 focus:border-primary-dark focus:ring focus:ring-primary-dark focus:ring-opacity-50 px-4 py-2"
            />
            <p className="text-xs text-gray-500 mt-1">{description?.length ?? 0}/{configurations.MAX_DESCRIPTION_LENGTH} characters</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-dark mb-1">{t('createExhibition.coverImageLabel')}</label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleCoverImageChange}
              accept="image/*"
              className="block w-full rounded-md shadow-sm bg-white font-medium text-sm border-gray-500 focus:ring-blue-600 focus:border-blue-600 mb-6"
            />
          </div>
          {coverImage && (
            <div className="mt-4">
              <p className="text-sm text-gray-500">{t('createExhibition.imagePreview')}</p>
              <ExhibitionThumbnail
                src={coverImage}
                alt="Cover preview"
                className="w-32 h-32"
                onDelete={handleRemoveImage}
              />
            </div>
          )}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => { onClose(); handleRemoveImage(); }}
              className="bg-gray-500 text-text-light px-4 py-2 rounded-md hover:bg-gray-600"
            >
              {t('createExhibition.cancel')}
            </button>
            <button
              type="submit"
              className="bg-primary text-text-light px-4 py-2 rounded-md hover:bg-primary-dark_hover"
              disabled={createExhibition.isPending}
            >
              {createExhibition.isPending ? t('createExhibition.saving') : t('createExhibition.create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateExhibitionModal;