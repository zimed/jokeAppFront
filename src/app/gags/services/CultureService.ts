import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root', // Make the service available application-wide
})
export class CultureService {
  private cultureSubject = new BehaviorSubject<string>(localStorage.getItem('selectedCulture') || '');
  culture$ = this.cultureSubject.asObservable(); // Expose the culture as an observable

  constructor() {}

  // Set the selected culture
  setCulture(culture: string): void {
    localStorage.setItem('selectedCulture', culture); // Save to localStorage
    this.cultureSubject.next(culture); // Emit the new culture
  }

  // Get the current culture
  getCulture(): string | null {
    return localStorage.getItem('selectedCulture');
  }

  getProfilImage(): string {
    if(localStorage.getItem('selectedCulture') == 'FR') {
      return 'assets/images/users/user_francais.png';
    } else if(localStorage.getItem('selectedCulture') == 'MAR') {
      return 'assets/images/users/user_marocain.png';
    }
    return 'assets/images/users/user_francais.png';
  }
  
}