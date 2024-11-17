"use client";
import { Plus, Trash2, X } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import QuizCreator from '~/components/quiz/quiz-creator'
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Separator } from '~/components/ui/separator';
import { useDeleteQuiz } from '~/hooks/quiz-actions';
import { useExhibitionIdFromParams } from '~/hooks/useExhibitionIdFromParams';
import { type CreateQuizDTO } from '~/lib/types/schemas';
import { generateEmptyQuiz } from '~/lib/utils/quiz-utils';
import { api } from '~/trpc/react';

const QuizzesPage = () => {
  const { t } = useTranslation();
  const id = useExhibitionIdFromParams();
  const { data: existingQuizzes, error, isLoading } = api.quiz.getAllByExhibitionId.useQuery({ exhibitionId: Number(id) });
  const [ quizzes, setQuizzes ] = useState<CreateQuizDTO[]>([]);
  const [ selectedQuiz, setSelectedQuiz ] = useState<CreateQuizDTO>(generateEmptyQuiz(id));
  const [ isEditable, setIsEditable ] = useState(false);

  const deleteQuiz = useDeleteQuiz();

  useEffect(() => {
    if (existingQuizzes) {
      setQuizzes(existingQuizzes);
    }
  }, [existingQuizzes]);

  function handleSelect(quiz: CreateQuizDTO) {
    setSelectedQuiz(quiz);
    setIsEditable(false);
  };

  function handleDelete(id: number) {
    deleteQuiz.mutate({ quizId: id });
  };

  function handleCancel() {
    setIsEditable(false);
    setSelectedQuiz(generateEmptyQuiz(id));
  }

  function handleNewQuiz() {
    setIsEditable(true);
    setSelectedQuiz(generateEmptyQuiz(id));
  }

  return (
    <main className='flex p-4 gap-4'>
       <Card className="w-1/3">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t('quizzes.quizzes')}</CardTitle> 
        </CardHeader>
        <CardContent>
          {error && <div>{t('quizzes.errorLoading')}</div>}
          {!selectedQuiz && <p> {t('quizzes.noQuizzes')}</p>}
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
      <Card  className="w-2/3">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t('quizzes.quizPreview')}</CardTitle>
          {selectedQuiz && (
            isEditable ? 
              <CancelButton onClick={handleCancel} /> : 
              <NewQuizButton onClick={() => handleNewQuiz()} />
          )}
        </CardHeader>
        <CardContent>
          {selectedQuiz ? 
            <QuizCreator
            creatorContent={selectedQuiz}
            disabled={!isEditable}
            onCreate={() => setIsEditable(false)}
            /> :  
            <div className="min-h-screen flex w-full justify-center items-center">{t('quizzes.noQuizSelected')}</div>
          }
        </CardContent>
      </Card>
      
    </main>
    );
}

const CancelButton = ({ onClick }: { onClick: () => void }) => {
  const { t } = useTranslation();
  return <Button onClick={onClick}> <><X/>{t('cancel')}</></Button>;
}

const NewQuizButton = ({ onClick }: { onClick: () => void }) => {
  const { t } = useTranslation();
  return <Button onClick={onClick}> <><Plus className="h-4 w-4" />{t('quizzes.newQuiz')}</></Button>;
}

export default QuizzesPage;