import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-culture-choice',
  templateUrl: './culture-choice.component.html',
  standalone: true,
  styleUrls: ['./culture-choice.component.scss']
})
export class CultureChoiceComponent implements OnInit {
  showPopup: boolean = false;
  cultures: string[] = ['MAROCAINE', 'FRANÇAISE', 'International']; // Example cultures
  selectedCulture: string | null = null;

  constructor() {}

  ngOnInit(): void {
    // Check if a culture is already selected
    this.selectedCulture = localStorage.getItem('selectedCulture');
    if (!this.selectedCulture) {
      this.showPopup = true; // Show popup if no culture is selected
    }
  }

  // Handle culture selection
  selectCulture(culture: string): void {
    this.selectedCulture = culture;
    localStorage.setItem('selectedCulture', culture); // Store the selected culture
    this.showPopup = false; // Hide the popup
  }
}
