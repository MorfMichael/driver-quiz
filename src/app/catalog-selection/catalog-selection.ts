import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CatalogService } from '../service/catalog.service';

@Component({
  selector: 'app-catalog-selection',
  imports: [],
  templateUrl: './catalog-selection.html',
  styleUrl: './catalog-selection.css',
})
export class CatalogSelection implements OnInit {
  private _catalogService = inject(CatalogService);
  private _catalogs = signal<Set<string>>(new Set<string>());

  catalogs = computed<Set<string>>(() => this._catalogs());

  async ngOnInit(): Promise<void> {
    const catalogs = await this._catalogService.getCatalogs();
    this._catalogs.set(catalogs);
  }
  
  setCatalog(catalog: string) {
    this._catalogService.setCatalog(catalog);
  }
}
