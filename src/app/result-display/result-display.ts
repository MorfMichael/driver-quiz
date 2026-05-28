import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-result-display',
  imports: [RouterLink],
  templateUrl: './result-display.html',
  styleUrl: './result-display.css',
})
export class ResultDisplay {
  private _service = inject(DataService);

  results = computed<{ questionId: string, correct: boolean | undefined }[]>(() => {
    const results = this._service.results();
    const questions = this._service.filteredQuestions();
    return questions?.map(question => ({ questionId: question.id, correct: results.find(d => d.questionId === question.id)?.correct })) ?? [];
  });
}
