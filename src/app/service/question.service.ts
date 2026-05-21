import { computed, inject, Injectable, signal } from '@angular/core';
import questions from './questions.json';
import { CatalogService } from './catalog.service';

const RESULTS_KEY: string = 'results';

@Injectable({ providedIn: 'root' })
export class QuestionService {
  private _catalogService = inject(CatalogService);
  private _catalog = computed<string | null>(() => this._catalogService.catalog());

  private _question = signal<Question | null>(null);
  private _questions = signal<Question[] | null>(null);

  question = computed<Question | null>(() => this._question());

  getQuestions(): Promise<Question[]> {
    const catalog = this._catalog();
    let result = this._questions();
    if (result === null) {
      if (catalog !== null) {
        result = questions.filter(x => x.catalog.includes(catalog));
      } else {
        result = questions;
      }
    }

    this._questions.set(result);
    return Promise.resolve(result);
  }

  nextQuestion(id?: string) {
    this.getQuestions().then(questions => {
      if (id && questions.findIndex(d => d.id === id) > -1) {
        const question = questions.find(d => d.id === id);
        this._question.set(question!);
      } else {
        let rand = Math.ceil(Math.random() * questions.length);
        this._question.set(questions[rand]);
      }
    });
  }

  getResults(): Promise<Result[]> {
    const storageResults = localStorage.getItem(RESULTS_KEY);
    if (storageResults) {
      const results: Result[] = JSON.parse(storageResults);
      return Promise.resolve(results);
    }

    return Promise.resolve([]);
  }

  addResult(result: Result) {
    this.getResults().then(d => {
      d.push(result);
      localStorage.setItem(RESULTS_KEY, JSON.stringify(d));
    });
  }
}

export type Result = {
  questionId: string;
  correct: boolean;
}

export type Question = {
  id: string;
  themeId: string;
  subject: string;
  catalog: string[];
  text: string;
  answers: Answer[];
}

export type Answer = {
  correct: boolean;
  text: string;
}