import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private filtersSubject = new BehaviorSubject<{ culture: string | null, category: string | null, type: string | null , status: string | null}>({
    culture: localStorage.getItem('selectedCulture'),
    category: null,
    type: null,
    status: 'APPROVED'
  });

  filters$ = this.filtersSubject.asObservable();

  updateFilters(filters: { culture: string | null, category: string | null, type: string | null, status: string | null }): void {
    this.filtersSubject.next(filters);
  }
}