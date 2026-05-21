import { Component, computed, effect, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CatalogService } from './service/catalog.service';
import { CatalogSelection } from './catalog-selection/catalog-selection';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CatalogSelection],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private _router = inject(Router);
  private _catalogService = inject(CatalogService);

  protected readonly title = signal('driver-quiz');
  catalog = computed<string | null>(() => this._catalogService.catalog());

  constructor() {
    effect(() => {
      const catalog = this.catalog();
      if (catalog !== null) {
        this._router.navigateByUrl('question');
      }
    })
  }
}
