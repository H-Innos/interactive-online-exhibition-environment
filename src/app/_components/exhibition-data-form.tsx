'use client'

import { useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { Label } from "~/components/ui/label"
import { PenSquare, Save, X } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { exhibitionFormSchema, type ExhibitionFormSchema } from '~/lib/types/schemas'
import { configurations } from '~/constants/config'
import { type Exhibition } from '../_types/exhibition'
import { useUpdateExhibition } from '~/hooks/exhibition-actions'
import { uploadImage } from '~/lib/utils/image-uploader'
import ExhibitionThumbnail from '~/components/exhibition-thumbnail'

interface ExhibitionDataFormProps {
  exhibition: Exhibition
}

export const ExhibitionDataForm: React.FC<ExhibitionDataFormProps> = ({ exhibition }) => {
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
  })

  const updtateExhibition = useUpdateExhibition();

  const handleEditToggle = () => {
    setIsEditing((isEditing) => !isEditing);
    reset();
  }

  const onSubmit: SubmitHandler<ExhibitionFormSchema> = async (data) => {
    const thumbnailUrl = await uploadImage(thumbnailDataUrl);
    if (!thumbnailUrl) return;

    updtateExhibition.mutate({
      id: exhibition.id,
      name: data.title,
      description: data.description,
      coverImageUrl: thumbnailUrl
    });
    setIsEditing(false)
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const previewUrl = reader.result as string;
      setThumbnailDataUrl(previewUrl);
      setValue("thumbnail", file);
    };
    reader.readAsDataURL(file);
  };
  
  const watchedFields = watch();

  return (
    <Card className="w-80 h-screen overflow-auto">
      <CardHeader className="sticky top-0 z-10 bg-background border-b">
        <div className="flex items-center justify-between">
          <CardTitle>Exhibition Details</CardTitle>
          <Button onClick={handleEditToggle} variant="outline" size="sm" className="hover:bg-primary-light w-32">
            {isEditing ? (
              <>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </>
            ) : (
              <>
                <PenSquare className="mr-2 h-4 w-4" />
                Edit
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...register("title")}
              readOnly={!isEditing}
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
          </div>
          <div className="space-y-2 mt-4">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              readOnly={!isEditing}
              rows={4}
              maxLength={configurations.MAX_DESCRIPTION_LENGTH}
              placeholder='A brief description of the exhibition'
            />
            {isEditing && (<p className="text-xs text-gray-500 mt-1">{watchedFields.description.length ?? 0}/{configurations.MAX_DESCRIPTION_LENGTH} characters </p>)}
            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
          </div>
          <div className="space-y-2 mt-4">
            <Label htmlFor="thumbnail">Thumbnail</Label>
            <div className="flex flex-col items-center space-y-2">
              <ExhibitionThumbnail
                src={thumbnailDataUrl ?? configurations.DEFAULT_COVER_IMAGE_URL}
                alt="Thumbnail"
                size={32}
              />

              {isEditing && (
                <input
                  id="thumbnail"
                  type="file"
                  onChange={handleThumbnailChange}
                  accept='image/*'
                  className="block w-full rounded-md shadow-sm bg-white font-medium text-sm border-gray-500 focus:ring-blue-600 focus:border-blue-600 mb-6"
                />
              )}
            </div>
            {errors.thumbnail && <p className="text-red-500 text-sm">{errors.thumbnail.message}</p>}
          </div>
          {isEditing && (
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  )
}