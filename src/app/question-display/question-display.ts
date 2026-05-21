import { Component, computed, effect, inject, input, OnInit, signal } from '@angular/core';
import { Answer, Question, QuestionService } from '../service/question.service';

@Component({
  selector: 'app-question-display',
  imports: [],
  templateUrl: './question-display.html',
  styleUrl: './question-display.css',
  host: {
    '(window:keydown)': 'windowKeyDown($event)'
  }
})
export class QuestionDisplay {
  private _questionService = inject(QuestionService);
  
  id = input<string>();
  question = computed<Question | null>(() => this._questionService.question());
  result = signal<boolean | undefined>(undefined);

  constructor() {
    effect(() => {
      const id = this.id();
      this._questionService.nextQuestion(id);
    });
  }

  selectAnswer(questionId: string, answer: Answer) {
    this.result.set(answer.correct);

    this._questionService.addResult({ correct: answer.correct, questionId: questionId });

    setTimeout(() => {
      this.result.set(undefined);
      this._questionService.nextQuestion();
    }, 2000);
  }

  windowKeyDown(event: KeyboardEvent) {
    const question = this.question();
    if (!question) {
      return;
    }

    switch (event.key) {
      case '1':
        this.selectAnswer(question.id, question.answers[0]);
        break;
      case '2':
        this.selectAnswer(question.id, question.answers[1]);
        break;
      case '3':
        this.selectAnswer(question.id, question.answers[2]);
        break;
      case '4':
        this.selectAnswer(question.id, question.answers[3]);
        break;
    }
  }
}

