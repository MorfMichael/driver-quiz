import { computed, inject, Injectable, OnInit, signal } from '@angular/core';
import questions from './questions.json';
import { CatalogService } from './catalog.service';

const RESULTS_KEY: string = 'results';

@Injectable({ providedIn: 'root' })
export class QuestionService implements OnInit {
  
  private _catalogService = inject(CatalogService);
  private _catalog = computed<string | null>(() => this._catalogService.catalog());

  private _question = signal<Question | null>(null);
  private _questions = signal<Question[] | null>(null);

  private _results = signal<Result[]>([]);

  question = computed<Question | null>(() => this._question());
  questions = computed<Question[] |  null>(() => this._questions());
  results = computed<Result[]>(() => this._results());
  resultOfQuestion = computed<Result | undefined>(() => {
    const question = this._question();
    const results = this._results();

    return results.find(d => d.questionId == question?.id);
  })

  async ngOnInit(): Promise<void> {
    const storageResults = localStorage.getItem(RESULTS_KEY);
    if (storageResults) {
      const results: Result[] = JSON.parse(storageResults);
      this._results.set(results);
    }
  }

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

  async getOpenQuestions(): Promise<Question[]> {
    const questions = await this.getQuestions();
    const results = this._results();

    return questions.filter(d => !results.find(x => x.questionId == d.id));
  }

  async nextQuestion(id?: string): Promise<void> {
    if (id !== undefined && questions.findIndex(d => d.id === id) > -1) {
      const question = questions.find(d => d.id === id);
      this._question.set(question!);
    } else {
      const questions = await this.getOpenQuestions();
      let rand = Math.ceil(Math.random() * questions.length);
      this._question.set(questions[rand]);
    }
  }

  getResult(questionId: string): Promise<Result | undefined> {
    const result = this._results().find(d => d.questionId == questionId); 
    return Promise.resolve(result);
  }

  async addResult(result: Result): Promise<void> {
    this._results.update(d => [...d, result]);
    localStorage.setItem(RESULTS_KEY, JSON.stringify(this.results()));
  }
}

export type Result = {
  questionId: string;
  answerId: number;
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