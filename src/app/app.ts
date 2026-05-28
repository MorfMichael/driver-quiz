import { Component, computed, effect, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CatalogSelection } from './catalog-selection/catalog-selection';
import { DataService } from './service/data.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CatalogSelection],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private _router = inject(Router);
  private _service = inject(DataService);

  protected readonly title = signal('driver-quiz');
  catalog = computed<string | null>(() => this._service.catalog());

  constructor() {
    effect(() => {
      const catalog = this.catalog();
      if (catalog !== null) {
        this._router.navigateByUrl('question');
      }
    })
  }
}
