// culture-choice.component.ts
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button'; // Import MatButtonModule
import { CultureService } from '../../services/CultureService'; // Import the CultureService  

@Component({
  selector: 'app-culture-choice',
  templateUrl: './culture-choice.component.html',
  standalone: true,
  styleUrls: ['./culture-choice.component.scss'],
  imports: [CommonModule, FormsModule, MatRadioModule, MatButtonModule], // Import modules correctly
})
export class CultureChoiceComponent implements OnInit {
  cultures = [
    { code: 'MAR', name: 'Marocaine' },
    { code: 'FR', name: 'Française' },
  ];
  selectedCulture: string = '';

  constructor(public dialogRef: MatDialogRef<CultureChoiceComponent>, private cultureService: CultureService) {}

  ngOnInit(): void {
    this.selectedCulture = localStorage.getItem('selectedCulture') || '';
  }

  // Save the selected culture and close the modal
  saveCulture(): void {
    this.cultureService.setCulture(this.selectedCulture); 
    this.dialogRef.close(this.selectedCulture);
  }

  // Close the modal without saving
  closeModal(): void {
    this.dialogRef.close();
  }
}