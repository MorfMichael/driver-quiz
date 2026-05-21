import { Routes } from '@angular/router';
import { QuestionDisplay } from './question-display/question-display';

export const routes: Routes = [
    {
        path: 'question',
        component: QuestionDisplay
    },
    {
        path: 'question/:id',
        component: QuestionDisplay
    }
];
