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

  ngOnInit() {
    this._catalogService.getCatalogs().then(d => this._catalogs.set(d));
  }
  
  setCatalog(catalog: string) {
    this._catalogService.setCatalog(catalog);
  }
}
