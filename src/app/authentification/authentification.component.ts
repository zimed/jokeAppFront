import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentification.component.html',
  styleUrls: ['./authentification.component.scss'],
})
export class AuthentificationComponent {
  username: string = '';
  password: string = '';
  confirmPassword: string = ''; // For registration
  errorMessage: string = '';
  isLoginMode: boolean = true; // Toggle between login and registration

  constructor(private authService: AuthService, private router: Router) {}

  // Toggle between login and registration modes
  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = ''; // Clear error message when toggling
  }

  // Handle form submission
  onSubmit(form: NgForm): void {
    if (form.invalid) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    if (!this.isLoginMode && this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    if (this.isLoginMode) {
      // Handle login
      this.authService.login(this.username, this.password).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          this.router.navigate(['/jokes']); // Redirect to the jokes page
        },
        error: (error) => {
          console.error('Login failed:', error);
          this.errorMessage = 'Invalid username or password.';
        },
      });
    } else {
      // Handle registration
      this.authService.register(this.username, this.password).subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          this.isLoginMode = true; // Switch to login mode after successful registration
          this.errorMessage = '';
        },
        error: (error) => {
          console.error('Registration failed:', error);
          this.errorMessage = 'Registration failed. Please try again.';
        },
      });
    }
  }
}