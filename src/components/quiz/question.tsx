import React, { useEffect } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import QuestionImage from "../question-image";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { Check } from "lucide-react";
import type { Answer, Question } from "~/lib/types/entities";

enum QuestionResult {
  CORRECT,
  INCORRECT,
  PARTIAL,
}

type QuestionCardProps = {
  question: Question;
  isSubmitted: boolean;
  onSubmit: () => void;
  onUnsubmit: () => void;
};

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, onSubmit, onUnsubmit, isSubmitted }) => {
  const [selectedAnswers, setSelectedAnswers] = React.useState<Answer[]>([]);
  const [result, setResult] = React.useState<QuestionResult>(QuestionResult.INCORRECT);

  const correctAnswers = question.answers.filter(answer => answer.isCorrect);
  const incorrectAnswers = question.answers.filter(answer => !answer.isCorrect);
  
  useEffect(() => {
    if (
      correctAnswers.every(answer => selectedAnswers.includes(answer)) && 
      incorrectAnswers.every(answer => !selectedAnswers.includes(answer))
    ) {
      setResult(QuestionResult.CORRECT);
    } else if (correctAnswers.some(answer => selectedAnswers.includes(answer))) {
      setResult(QuestionResult.PARTIAL);
    } else {
      setResult(QuestionResult.INCORRECT);
    }
  }, [selectedAnswers, correctAnswers, incorrectAnswers]);

  function onAnswerToggle(selectedAnswer: Answer) {
    onUnsubmit();
    setSelectedAnswers(prev => 
      prev.includes(selectedAnswer)
        ? prev.filter(answer => selectedAnswer !== answer)
        : [...prev, selectedAnswer]
    );
  };

  return (
    <Card className="w-72">
      <CardHeader>
        {question.text}
        {question.imageUrl && (
          <QuestionImage src={question.imageUrl} />
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {question.answers.map((answer: Answer, index: number) => (
            <div key={index} className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
              <Checkbox
                id={`answer-${index}`}
                checked={selectedAnswers.includes(answer)}
                onCheckedChange={() => onAnswerToggle(answer)}
              />
              <Label
                htmlFor={`answer-${index}`}
                className="flex-grow cursor-pointer break-words"
              >
                {answer.text}
              </Label>
            </div>
          ))}
        </div>
        {isSubmitted 
          ? <FeedBackLabel result={result} correctAnswers={correctAnswers} />
          : <FeedBackLabelPlaceholder />
        }
        <div className="flex justify-end w-full mt-2">
          <Button
            type="button"
            onClick={() => {onSubmit()}}
          >
            <Check className="h-4 w-4" /> Check Answer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

const FeedBackLabel: React.FC<{ result: QuestionResult, correctAnswers: Answer[] }> = ({ result, correctAnswers }) => {
  switch (result) {
    case QuestionResult.CORRECT:
      return (
      <div className='w-full p-4 rounded-md bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 break-words'>
        Correct!
        </div>
      );
    case QuestionResult.INCORRECT:
      return (
        <div className="w-full p-4 rounded-md bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100 break-words">
          Incorrect. The correct answer{correctAnswers.length > 1 ? 's are' : ' is'}: {correctAnswers.map(a => a.text).join(', ')}
        </div>
      );
    case QuestionResult.PARTIAL:
      return (
        <div className="w-full p-4 rounded-md bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100 break-words">
          Partially correct. The correct answer{correctAnswers.length > 1 ? 's are' : ' is'}: {correctAnswers.map(a => a.text).join(', ')}
        </div>
      ); 
    default:
      throw new Error('Unknown question result');
  }
};

const FeedBackLabelPlaceholder: React.FC = () => {
  return (
    <div className="p-4 rounded-md break-words">&nbsp;</div>
  );
};