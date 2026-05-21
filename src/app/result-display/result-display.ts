import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { QuestionService, Result } from '../service/question.service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-result-display',
  imports: [RouterLink],
  templateUrl: './result-display.html',
  styleUrl: './result-display.css',
})
export class ResultDisplay {
  private _questionService = inject(QuestionService);

  results = computed<{ questionId: string, correct: boolean | undefined }[]>(() => {
    const results = this._questionService.results();
    const questions = this._questionService.questions();
    return questions?.map(question => ({ questionId: question.id, correct: results.find(d => d.questionId === question.id)?.correct })) ?? [];
  });
}
