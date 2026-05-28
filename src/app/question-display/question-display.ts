import { Component, computed, effect, inject, input, OnInit, signal, untracked } from '@angular/core';
import { ResultDisplay } from "../result-display/result-display";
import { CommonModule } from '@angular/common';
import { DataService, Question, Result } from '../service/data.service';
import { Router } from '@angular/router';

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
  private _service = inject(DataService);
  private _router = inject(Router);
  
  id = input<string>();
  question = computed<Question | null>(() => this._service.question());
  result = computed<Result | undefined>(() => this._service.resultOfQuestion());

  constructor() {
    effect(() => {
      const id = this.id();
      untracked(() => this._service.nextQuestion(id));
    });
  }

  selectAnswer(index: number) {
    const question = this.question();
    if (!question) {
      return;
    }
    const answer = question.answers[index];
    this._service.addResult({ correct: answer.correct, questionId: question.id, answerId: index });
  }

  windowKeyDown(event: KeyboardEvent) {
    const question = this.question();
    if (!question) {
      return;
    }

    if (event.key === '1') {
        this.selectAnswer(0);
    } else if (event.key === '2') {
      this.selectAnswer(1);
    } else if (event.key === '3') {
      this.selectAnswer(2);
    } else if (event.key === '4') {
      this.selectAnswer(3);
    } else if (event.code === 'Space' || event.code === 'Enter' || event.code === 'NumpadEnter' || event.code === 'ArrowRight') {
      if (this.id()) {
        this._router.navigate(['question']);
      } else {
        this.nextQuestion();
      }
    } else if (event.code === 'ArrowLeft') {
      const id = this.id();
      const results = this._service.results();
      let index = results.findIndex(d => d.questionId == id);
      if (index < 1) {
        index = results.length;
      }
      const previousId = results[index-1].questionId;
      console.log(previousId,index);
      this._router.navigate(['question', previousId]);
    }
  }

  nextQuestion(id?: string) {
    this._service.nextQuestion(id);
  }

  reset() {
    this._service.reset();
  }
}

