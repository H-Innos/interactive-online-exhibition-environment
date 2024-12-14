"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { Save } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  exhibitionFormSchema,
  type ExhibitionFormSchema,
} from "~/lib/types/schemas";
import { configurations } from "~/lib/constants/config";
import { useUpdateExhibition } from "~/hooks/exhibition-actions";
import { uploadImage } from "~/lib/utils/image-uploader";
import RemovableImage from "~/components/removable-image";
import FileUploadButton from "~/components/file-upload-button";
import { useTranslation } from "react-i18next";
import { Exhibition } from "~/lib/types/entities";

interface ExhibitionDataFormProps {
  exhibition: Exhibition;
  onSave: () => void;
}

export const ExhibitionDataForm: React.FC<ExhibitionDataFormProps> = ({
  exhibition,
  onSave,
}) => {
  const { t } = useTranslation();
  const [coverImage, setCoverImage] = useState(exhibition.thumbnailUrl ?? "");
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ExhibitionFormSchema>({
    defaultValues: {
      title: exhibition.name,
      description: exhibition.description ?? "",
      coverImage: undefined,
    },
    resolver: zodResolver(exhibitionFormSchema),
  });

  const updateExhibition = useUpdateExhibition();

  const onSubmit: SubmitHandler<ExhibitionFormSchema> = async (data) => {
    onSave();
    const thumbnailUrl = await uploadImage(coverImage);
    if (!thumbnailUrl) return;

    updateExhibition.mutate({
      id: exhibition.id,
      name: data.title,
      description: data.description,
      thumbnailUrl,
    });
  };

  const handleThumbnailChange = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setCoverImage(reader.result as string);
      setValue("coverImage", file);
    };
    reader.readAsDataURL(file);
  };

  const handleThumbnailDelete = () => {
    setCoverImage("");
    setValue("coverImage", undefined);
  };

  return (
    <Card className="md:w-100 w-full">
      <CardHeader className="sticky top-0 border-b bg-background">
        <CardTitle>{t("exhibitionDetails")}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title">{t("title")}</Label>
            <Input id="title" {...register("title")} />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="description">{t("description")}</Label>
            <Textarea
              id="description"
              {...register("description")}
              rows={4}
              maxLength={configurations.MAX_DESCRIPTION_LENGTH}
              placeholder={t("descriptionPlaceholder")}
            />
            <p className="text-xs text-gray-500">
              {watch("description")?.length ?? 0}/
              {configurations.MAX_DESCRIPTION_LENGTH} {t("characters")}
            </p>
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="thumbnail">{t("thumbnail")}</Label>
            <RemovableImage
              src={coverImage || configurations.DEFAULT_COVER_IMAGE_URL}
              alt={t("thumbnail")}
              className="mb-4 h-32 w-32 md:h-48 md:w-48"
              onDelete={handleThumbnailDelete}
            />
            <FileUploadButton
              onFileSelect={handleThumbnailChange}
              accept="image/*"
              disabled={isSubmitting}
            />
            {errors.coverImage && (
              <p className="text-sm text-red-500">
                {errors.coverImage.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            variant="outline"
            disabled={isSubmitting}
            className="w-full"
          >
            <Save className="mr-2 h-4 w-4" />
            {t("saveChanges")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
