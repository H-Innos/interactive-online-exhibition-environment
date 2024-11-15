'use client'

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { PenSquare, Save, X } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { exhibitionFormSchema, type ExhibitionFormSchema } from '~/lib/types/schemas';
import { configurations } from '~/lib/constants/config';
import { type Exhibition } from '../../lib/types/exhibition';
import { useUpdateExhibition } from '~/hooks/exhibition-actions';
import { uploadImage } from '~/lib/utils/image-uploader';
import RemovableImage from '~/components/removable-image';
import FileUploadButton from '~/components/file-upload-button';
import { useTranslation } from 'react-i18next';

interface ExhibitionDataFormProps {
  exhibition: Exhibition;
}

export const ExhibitionDataForm: React.FC<ExhibitionDataFormProps> = ({ exhibition }) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [thumbnailDataUrl, setThumbnailDataUrl] = useState(exhibition.coverImageUrl ?? "");
  const {
    register, 
    handleSubmit, 
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ExhibitionFormSchema>({
    defaultValues: {
      title: exhibition.name,
      description: exhibition.description ?? "",
      thumbnail: undefined
    },
    resolver: zodResolver(exhibitionFormSchema)
  });

  const updateExhibition = useUpdateExhibition();

  const handleEditToggle = () => {
    setIsEditing((isEditing) => !isEditing);
    setThumbnailDataUrl(exhibition.coverImageUrl ?? "");
    reset();
  };

  const onSubmit: SubmitHandler<ExhibitionFormSchema> = async (data) => {
    const thumbnailUrl = await uploadImage(thumbnailDataUrl);
    if (!thumbnailUrl) return;

    updateExhibition.mutate({
      id: exhibition.id,
      name: data.title,
      description: data.description,
      coverImageUrl: thumbnailUrl
    });
    setIsEditing(false);
  };

  const handleThumbnailChange = (file: File) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const previewUrl = reader.result as string;
      setThumbnailDataUrl(previewUrl);
      setValue("thumbnail", file);
    };
    reader.readAsDataURL(file);
  };

  const handleThumbnailDelete = () => {
    setThumbnailDataUrl("");
    setValue("thumbnail", undefined);
  };
  
  const watchedFields = watch();

  return (
    <Card className="w-full md:w-100 overflow-auto">
      <CardHeader className="sticky top-0 z-10 bg-background border-b">
        <div className="flex items-center justify-between">
          <CardTitle>{t('exhibitionDetails')}</CardTitle>
          <Button onClick={handleEditToggle} variant="outline" size="sm" className="w-32 h-10">
            {isEditing ? (
              <>
                <X className="mr-2 h-4 w-4" />
                {t('cancel')}
              </>
            ) : (
              <>
                <PenSquare className="mr-2 h-4 w-4" />
                {t('edit')}
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="title">{t('title')}</Label>
            <Input
              id="title"
              {...register("title")}
              readOnly={!isEditing}
            />
            <p className="text-sm h-5">
              {errors.title ? <span className="text-red-500">{errors.title.message}</span> : <span>&nbsp;</span>}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">{t('description')}</Label>
            <Textarea
              id="description"
              {...register("description")}
              readOnly={!isEditing}
              rows={4}
              maxLength={configurations.MAX_DESCRIPTION_LENGTH}
              placeholder={t('descriptionPlaceholder')}
            />
            <p className="text-xs text-gray-500 mt-1">{watchedFields.description.length ?? 0}/{configurations.MAX_DESCRIPTION_LENGTH} {t('characters')}</p>
            <p className="text-sm h-5">
              {errors.description ? <span className="text-red-500">{errors.description.message}</span> : <span>&nbsp;</span>}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="thumbnail">{t('thumbnail')}</Label>
            <div className="flex flex-col items-start space-y-2">
              <RemovableImage
                src={thumbnailDataUrl || configurations.DEFAULT_COVER_IMAGE_URL}
                alt={t('thumbnail')}
                className="w-48 h-48"
                onDelete={isEditing ? handleThumbnailDelete : undefined}
              />
              <FileUploadButton
                onFileSelect={handleThumbnailChange}
                accept='image/*'
                disabled={isSubmitting || !isEditing}
              />
            </div>
            <p className="text-sm h-5">
              {errors.thumbnail ? <span className="text-red-500">{errors.thumbnail.message}</span> : <span>&nbsp;</span>}
            </p>
          </div>
          <Button
            type="submit"
            variant="outline"
            disabled={isSubmitting || !isEditing}
            className="w-full mt-4"
          >
            <Save className="mr-2 h-4 w-4" />
            {t('saveChanges')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}