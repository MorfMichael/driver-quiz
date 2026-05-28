import { Routes } from '@angular/router';
import { QuestionDisplay } from './question-display/question-display';
import { FinishDisplay } from './finish-display/finish-display';

export const routes: Routes = [
    {
        path: 'finish',
        component: FinishDisplay
    },
    {
        path: 'question',
        component: QuestionDisplay
    },
    {
        path: 'question/:id',
        component: QuestionDisplay
    }
];
