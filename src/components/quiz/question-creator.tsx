import { PlusCircle, X, Image as ImageIcon } from "lucide-react"
import { Card, CardContent, CardTitle } from "../ui/card"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Checkbox } from "../ui/checkbox"
import QuestionImage from "../question-image"
import { type Question } from "~/lib/types/schemas"

type QuestionCreatorProps = {
  question: Question
  onUpdate: (updatedQuestion: Question) => void
  onDelete: () => void
}

export function QuestionCreator({ 
  question, 
  onUpdate, 
  onDelete 
}: QuestionCreatorProps) {

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
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center justify-between px-6 pb-6">
        <CardTitle className="text-lg">Question</CardTitle>
      </div>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`question-${question.id}`}>Question Text</Label>
            <Input
              id={`question-${question.id}`}
              value={question.text}
              onChange={(e) => onUpdate({ ...question, text: e.target.value })}
              placeholder="Enter your question here"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`image-${question.id}`}>Question Image (optional)</Label>
            <div className="flex items-center space-x-2">
              <Input
                id={`image-${question.id}`}
                type="file"
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById(`image-${question.id}`)?.click()}
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                Upload Image
              </Button>
              {question.imageUrl && <span className="text-sm text-muted-foreground">Image uploaded</span>}
            </div>
          </div>

          {question.imageUrl && <QuestionImage src={question.imageUrl} />}

          <div className="space-y-4">
            <Label>Answers</Label>
            {question.answers.map((answer, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`correct-${question.id}-${index}`}
                  checked={answer.isCorrect}
                  onCheckedChange={() => toggleCorrect(index)}
                />
                <Input
                  value={answer.text}
                  onChange={(e) => updateAnswer(index, e.target.value)}
                  placeholder={`Answer ${index + 1}`}
                  required
                />
                {question.answers.length > 2 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeAnswer(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {question.answers.length < 4 && (
            <Button type="button" variant="outline" onClick={addAnswer}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Answer
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}