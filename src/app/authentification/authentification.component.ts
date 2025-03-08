import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentification.component.html',
  styleUrls: ['./authentification.component.scss'],
})
export class AuthentificationComponent {
  username: string = '';
  email: string = ''; // For registration
  password: string = '';
  confirmPassword: string = ''; // For registration
  forgotUsername: string = ''; // For forgot password
  errorMessage: string = '';
  successMessage: string = '';
  isLoginMode: boolean = true; // Toggle between login and registration
  isForgotPasswordMode: boolean = false; // Toggle for forgot password

  constructor(private authService: AuthService, private router: Router) {}

  // Toggle between login and registration modes
  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = ''; // Clear error message when toggling
    this.successMessage = ''; // Clear success message when toggling
  }

  // Toggle for forgot password mode
  toggleForgotPasswordMode(): void {
    this.isForgotPasswordMode = !this.isForgotPasswordMode;
    this.errorMessage = ''; // Clear error message when toggling
    this.successMessage = ''; // Clear success message when toggling
  }

  // Handle form submission for login and registration
  onSubmit(form: NgForm): void {
    if (form.invalid) {
      this.errorMessage = 'Veuillez remplir tous les champs.';
      return;
    }

    if (!this.isLoginMode && this.password !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas.';
      return;
    }

    if (this.isLoginMode) {
      // Handle login
      this.authService.login(this.username, this.password).subscribe({
        next: (response) => {
          console.log('Connexion réussie:', response);
          this.router.navigate(['/jokes']); // Redirect to the jokes page
        },
        error: (error) => {
          console.error('Échec de la connexion:', error);
          this.errorMessage = 'Nom d\'utilisateur ou mot de passe invalide.';
        },
      });
    } else {
      // Handle registration
      this.authService.register(this.username, this.email, this.password).subscribe({
        next: (response) => {
          console.log('Inscription réussie:', response);
          this.isLoginMode = true; // Switch to login mode after successful registration
          this.errorMessage = '';
        },
        error: (error) => {
          console.error('Échec de l\'inscription:', error);
          this.errorMessage = 'L\'inscription a échoué. Veuillez réessayer.';
        },
      });
    }
  }

  // Handle form submission for forgot password
  onForgotPasswordSubmit(form: NgForm): void {
    if (form.invalid) {
      this.errorMessage = 'Veuillez entrer votre nom d\'utilisateur.';
      return;
    }

    this.authService.forgotPassword(this.forgotUsername).subscribe({
      next: (response) => {
        console.log('Email de réinitialisation envoyé:', response);
        this.successMessage = response; // Display the plain text response
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('Échec de l\'envoi de l\'email:', error);
        this.errorMessage = 'Échec de l\'envoi de l\'email. Veuillez réessayer.';
        this.successMessage = '';
      },
    });
  }
}