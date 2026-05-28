import { computed, inject, Injectable, signal } from '@angular/core';
import questions from './questions.json';
import { Router } from '@angular/router';

const CATALOG_KEY: string = 'catalog';
const RESULTS_KEY: string = 'results';

@Injectable({ providedIn: 'root' })
export class DataService {
  private _router = inject(Router);

  private _catalogs = signal<Set<string>>(new Set<string>());
  private _catalog = signal<string | null>(null);

  private _question = signal<Question | null>(null);
  private _results = signal<Result[]>([]);

  catalogs = this._catalogs.asReadonly();
  catalog = this._catalog.asReadonly();
  
  question = this._question.asReadonly();
  results = this._results.asReadonly();

  filteredQuestions = computed<Question[]>(() => {
    const catalog = this._catalog();
    return catalog ? questions.filter(x => x.catalog.includes(catalog)) : questions;
  });

  openQuestions = computed<Question[]>(() => {
    const questions = this.filteredQuestions();
    const results = this._results();

    return questions.filter(d => !results.find(x => x.questionId == d.id));
  });

  resultOfQuestion = computed<Result | undefined>(() => {
    const question = this._question();
    const results = this._results();

    return results.find(d => d.questionId == question?.id);
  })

  constructor() {
    this.initCatalog();
    this.initResults();
  }

  setCatalog(catalog: string | null) {
    this._catalog.set(catalog);

    if (catalog === null) {
      localStorage.removeItem(CATALOG_KEY);
    } else {
      localStorage.setItem(CATALOG_KEY, catalog);
    }
  }

  async nextQuestion(id?: string): Promise<void> {
    if (id !== undefined && questions.findIndex(d => d.id === id) != -1) {
      const question = questions.find(d => d.id === id);
      this._question.set(question!);
    } else {
      const questions = this.openQuestions();
      let nextId = '1';
      if (questions.length > 0) {
        let rand = Math.ceil(Math.random() * (questions.length-1));
        nextId = questions[rand].id;
      } else {
        nextId = this.results()[0].questionId;
      }
      this._router.navigate(['question', nextId]);
    }
  }

  addResult(result: Result) {
    this._results.update(d => [...d, result]);
    localStorage.setItem(RESULTS_KEY, JSON.stringify(this.results()));
  }

  reset() {
    localStorage.removeItem(CATALOG_KEY);
    this._catalog.set(null);
    
    localStorage.removeItem(RESULTS_KEY);
    this._results.set([]);
  }

  private initResults() {
    const storageResults = localStorage.getItem(RESULTS_KEY);
    if (storageResults) {
      const results: Result[] = JSON.parse(storageResults);
      this._results.set(results);
    }
  }

  private initCatalog() {
    const catalogs = new Set<string>(questions.flatMap(d => d.catalog));
    this._catalogs.set(catalogs);

    const catalog = localStorage.getItem(CATALOG_KEY);
    this._catalog.set(catalog);
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