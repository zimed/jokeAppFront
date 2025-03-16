import { Component, Inject  } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { GagService } from '../../services/GagService';

@Component({
  selector: 'app-delete-confirmation-dialog',
  templateUrl: './delete-confirmation-dialog.component.html',
  standalone: true,
  styleUrls: ['./delete-confirmation-dialog.component.scss'],
  imports: [MatDialogModule, MatButtonModule, CommonModule], // Add required modules here
})
export class DeleteConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { jokeId: number }, // Inject the jokeId
    private gagService: GagService, // Inject the GagService
  ) {}

  onDelete(): void {
    this.gagService.deleteJoke(this.data.jokeId).subscribe({
      next: () => {
        this.dialogRef.close(true); // Close the dialog and return `true` to indicate success
      },
      error: (err) => {
        console.error('Error deleting joke:', err);
      },
    });
  }

  onCancel(): void {
    this.dialogRef.close(false); // Close the dialog and return `false` to indicate cancellation
  }
}