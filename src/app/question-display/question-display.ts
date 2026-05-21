import { Component, computed, effect, inject, input, OnInit, signal } from '@angular/core';
import { Answer, Question, QuestionService, Result } from '../service/question.service';
import { ResultDisplay } from "../result-display/result-display";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-question-display',
  imports: [CommonModule, ResultDisplay],
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
  result = computed<Result | undefined>(() => this._questionService.resultOfQuestion());

  constructor() {
    effect(() => {
      const id = this.id();
      this._questionService.nextQuestion(id);
    });

    effect(() => {
      const result = this.result();
      console.log('result changed!');
    })
  }

  selectAnswer(index: number) {
    const question = this.question();
    if (!question) {
      return;
    }
    const answer = question.answers[index];

    this._questionService.addResult({ correct: answer.correct, questionId: question.id, answerId: index });

    setTimeout(() => {
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
        this.selectAnswer(0);
        break;
      case '2':
        this.selectAnswer(1);
        break;
      case '3':
        this.selectAnswer(2);
        break;
      case '4':
        this.selectAnswer(3);
        break;
    }
  }
}

