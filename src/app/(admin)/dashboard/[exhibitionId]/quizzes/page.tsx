"use client";
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import QuizCreator from '~/components/quiz/quiz-creator'
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Separator } from '~/components/ui/separator';
import { useCreateQuiz, useDeleteQuiz } from '~/hooks/quiz-actions';
import { useExhibitionIdFromParams } from '~/hooks/useExhibitionIdFromParams';
import { type CreateQuizDTO } from '~/lib/types/schemas';
import { generateEmptyQuiz } from '~/lib/utils/quiz-utils';
import { api } from '~/trpc/react';

const QuizzesPage = () => {
  const id = useExhibitionIdFromParams();
  const { data: existingQuizzes, error, isLoading } = api.quiz.getAllByExhibitionId.useQuery({ exhibitionId: Number(id) });
  const [ quizzes, setQuizzes ] = useState<CreateQuizDTO[]>([]);
  const [ selectedQuiz, setSelectedQuiz ] = useState<CreateQuizDTO>(generateEmptyQuiz(id));
  const [ isEditable, setIsEditable ] = useState(false);

  const deleteQuiz = useDeleteQuiz();
  const createQuiz = useCreateQuiz();

  useEffect(() => {
    if (existingQuizzes) {
      setQuizzes(existingQuizzes);
    }
  }, [existingQuizzes]);

  function handleSelect(quiz: CreateQuizDTO) {
    setSelectedQuiz(quiz);
  };

  function handleDelete(id: number) {
    deleteQuiz.mutate({ quizId: id });
  };

  function handleNewQuiz() {
    createQuiz.mutate(generateEmptyQuiz(id));
  };

  return (
    <div className='flex p-4 gap-4'>
       <Card className="w-1/3">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Quizzes</CardTitle>
          <Button size="icon" onClick={handleNewQuiz}>
            <Plus className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {error && <div>Error loading quizzes.</div>}
          {!selectedQuiz && <p> There are currently no quizzes.</p>}
          {isLoading && <div>Loading...</div>}
          <ul className="space-y-1">
            {quizzes.map((quiz) => (
              <li key={quiz.id}>
                <div className="flex items-center justify-between py-2">
                  <button
                    className="text-left font-medium hover:underline"
                    onClick={() => handleSelect(quiz)}
                  >
                    {quiz.title}
                  </button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(quiz.id!)}
                    aria-label={`Delete ${quiz.title}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Separator />
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card className="w-2/3">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Quiz Preview</CardTitle>
          {selectedQuiz && (
            <Button 
              onClick={() => setIsEditable(prev => (!prev))}
            >
              {isEditable ? <><X /> Cancel</> : <><Pencil className="h-4 w-4" /> Edit</>} 
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {selectedQuiz ? 
            <QuizCreator
            creatorContent={selectedQuiz}
            disabled={!isEditable}
            onCreate={() => setIsEditable(false)}
            /> :  
            <div className="min-h-screen flex w-full justify-center items-center">Select a quiz to start editing.</div>
          }
        </CardContent>
      </Card>
      
    </div>
    );
}

export default QuizzesPage;