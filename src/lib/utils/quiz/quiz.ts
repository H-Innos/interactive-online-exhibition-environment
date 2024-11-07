import QuizUI from './quiz-ui';
import QuizEditing from './quiz-editing';

export default class Quiz {
    static get requires() {
        return [
            QuizUI,
            QuizEditing
        ];
    }
}