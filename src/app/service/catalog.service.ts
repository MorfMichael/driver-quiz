import { Injectable, OnInit, signal } from '@angular/core';

import questions from './questions.json';

const CATALOG_KEY: string = 'catalog';

@Injectable({ providedIn: 'root' })
export class CatalogService implements OnInit {
    private _catalogs: Set<string> | undefined = undefined;
    private _catalog = signal<string | null>(null);

    get catalog() {
        return this._catalog.asReadonly();
    }

    ngOnInit(): void {
        const catalog = localStorage.getItem(CATALOG_KEY);
        this._catalog.set(catalog);
    }

    getCatalogs(): Promise<Set<string>> {
        if (this._catalogs === undefined) {
            const catalogs = new Set<string>(questions.flatMap(d => d.catalog));
            this._catalogs = catalogs;
        }

        return Promise.resolve(this._catalogs);
    }

    setCatalog(catalog: string | null): Promise<void> {
        this._catalog.set(catalog);

        if (catalog === null) {
            localStorage.removeItem(CATALOG_KEY);
        } else {
            localStorage.setItem(CATALOG_KEY, catalog);
        }

        return Promise.resolve();
    }
}