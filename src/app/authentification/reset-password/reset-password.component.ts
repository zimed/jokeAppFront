import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  standalone: true, // Mark the component as standalone
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule], // Import required modules
})
export class ResetPasswordComponent implements OnInit {
  newPassword: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  token: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Extract the token from the query parameters
    this.route.queryParamMap.subscribe((params) => {
      this.token = params.get('token') || '';
      if (!this.token) {
        this.errorMessage = 'Token invalide ou manquant.';
      }
    });
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas.';
      return;
    }

    // Call the reset password API
    this.authService.resetPassword(this.token, this.newPassword).subscribe({
      next: (response) => {
        console.log('Réinitialisation du mot de passe réussie:', response.message);
        this.successMessage = response.message; // Display the message from the JSON response
        this.errorMessage = '';
        setTimeout(() => {
          this.router.navigate(['/login']); // Redirect to login page
        }, 3000);
      },
      error: (error) => {
        console.error('Échec de la réinitialisation du mot de passe:', error);
        this.errorMessage = 'Échec de la réinitialisation du mot de passe. Veuillez réessayer.';
        this.successMessage = '';
      },
    });
  }
}