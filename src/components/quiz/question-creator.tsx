"use client";

import { PlusCircle, X, Image as ImageIcon } from "lucide-react"
import { Card, CardContent, CardTitle } from "../ui/card"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Checkbox } from "../ui/checkbox"
import { type CreateQuestionDTO } from "~/lib/types/schemas"
import { useTranslation } from "react-i18next";
import RemovableImage from "../removable-image";

type QuestionCreatorProps = {
  question: CreateQuestionDTO
  order: number
  onUpdate: (updatedQuestion: CreateQuestionDTO) => void
  onDelete: () => void
  disabled: boolean
}

export function QuestionCreator({ 
  question,
  order, 
  onUpdate, 
  onDelete,
  disabled
}: QuestionCreatorProps) {
  const { t } = useTranslation();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        onUpdate({ ...question, imageUrl: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const addAnswer = () => {
    if (question.answers.length < 4) {
      onUpdate({
        ...question,
        answers: [...question.answers, {id: Date.now(), text: "", isCorrect: false }],
      })
    }
  }

  const removeAnswer = (index: number) => {
    if (question.answers.length > 2) {
      onUpdate({
        ...question,
        answers: question.answers.filter((_, i) => i !== index),
      })
    }
  }

  const updateAnswer = (index: number, text: string) => {
    const newAnswers = [...question.answers];
    if (newAnswers[index]) {
      newAnswers[index].text = text;
      onUpdate({ ...question, answers: newAnswers });
  }
  }

  const toggleCorrect = (index: number) => {
    const newAnswers = [...question.answers];
    if (newAnswers[index]) {
      newAnswers[index].isCorrect = !newAnswers[index].isCorrect;
      onUpdate({ ...question, answers: newAnswers });
    }
  }

  return (
    <Card className="mb-6">
      <div className="flex items-center justify-end">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onDelete}
          disabled={disabled}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center justify-between px-6 pb-6">
        <CardTitle className="text-lg">{`${t('quizzes.questionTitle')} ${order + 1}`}</CardTitle>
      </div>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`question-${question.id}`}>{t('quizzes.questionTextLabel')}</Label>
            <Input
              id={`question-${question.id}`}
              value={question.text}
              onChange={(e) => onUpdate({ ...question, text: e.target.value })}
              placeholder={t('quizzes.questionTextPlaceholder')}
              required
              readOnly={disabled}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`image-${question.id}`}>{t('quizzes.questionImageLabel')}</Label>
            <div className="flex items-center space-x-2">
              <Input
                id={`image-${question.id}`}
                type="file"
                onChange={handleImageUpload}
                accept="image/*"
                readOnly={disabled}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById(`image-${question.id}`)?.click()}
                disabled={disabled}
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                {t('uploadImage')}
              </Button>
              {question.imageUrl && <span className="text-sm text-muted-foreground">{t('imageUploaded')}</span>}
            </div>
          </div>

          {question.imageUrl && 
          <RemovableImage 
            src={question.imageUrl} 
            alt="Question image" 
            onDelete={() => onUpdate({ ...question, imageUrl: null })}
            className="w-60 h-60"  
          />
          }

          <div className="space-y-4">
            <Label>{t('quizzes.answers')}</Label>
            {question.answers.map((answer, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  data-testid='answer-checkbox'
                  id={`correct-${question.id}-${index}`}
                  checked={answer.isCorrect}
                  onCheckedChange={() => toggleCorrect(index)}
                  disabled={disabled}
                />
                <Input
                  data-testid='answer-input'
                  value={answer.text}
                  onChange={(e) => updateAnswer(index, e.target.value)}
                  placeholder={`${t('quizzes.answer')} ${index + 1}`}
                  required
                  readOnly={disabled}
                />
                {question.answers.length > 2 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeAnswer(index)}
                    disabled={disabled}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {question.answers.length < 4 && (
            <Button type="button" variant="outline" onClick={addAnswer} disabled={disabled}>
              <PlusCircle className="mr-2 h-4 w-4" />
              {t('quizzes.addAnswer')}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}