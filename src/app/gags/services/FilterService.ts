import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private filtersSubject = new BehaviorSubject<{ culture: string | null, category: string | null, type: string | null }>({
    culture: null,
    category: null,
    type: null
  });

  filters$ = this.filtersSubject.asObservable();

  updateFilters(filters: { culture: string | null, category: string | null, type: string | null }) {
    this.filtersSubject.next(filters);
  }
}