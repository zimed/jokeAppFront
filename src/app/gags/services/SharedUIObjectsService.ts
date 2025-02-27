// status.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedUIObjectsService {
  private showSecondaryMenuSubject = new BehaviorSubject<boolean>(false);
  
  // Observable to subscribe to
  showSecondaryMenu$ = this.showSecondaryMenuSubject.asObservable();
  
  // Method to update the status
  updateShowSecondaryMenu(status: boolean): void {
    this.showSecondaryMenuSubject.next(status);
  }
}