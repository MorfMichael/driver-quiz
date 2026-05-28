import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DataService } from '../service/data.service';

@Component({
  selector: 'app-catalog-selection',
  imports: [],
  templateUrl: './catalog-selection.html',
  styleUrl: './catalog-selection.css',
})
export class CatalogSelection {
  data = inject(DataService);
}
