import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  private apiUrl = 'http://localhost:8080/auth'; // Base URL for authentication endpoints
  private tokenKey = 'authToken'; // Key for storing the JWT token in localStorage

  constructor(private router: Router, private http: HttpClient) {}

  // Login method
  login(username: string, password: string): Observable<any> {
    const payload = { username, password };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    // Set responseType to 'text' to handle plain text responses
    return this.http.post(`${this.apiUrl}/login`, payload, { headers, responseType: 'text' }).pipe(
      tap((response: string) => {
        // Store the JWT token in localStorage
        if (response) {
          localStorage.setItem(this.tokenKey, response);
          localStorage.setItem('username', username);
          this.isLoggedInSubject.next(true); // Update login status
        }
      })
    );
  }

  // Registration method
  register(username: string, password: string): Observable<string> {
    const payload = { username, password };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(`${this.apiUrl}/register`, payload, { headers, responseType: 'text' });
  }

  // Check if the user is logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey); // Check if token exists in localStorage
  }

  // Get the connected username
  getConnectedUsername(): string | null {
    return localStorage.getItem('username');
  }

  // Get the JWT token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Logout method
  logout(): void {
    localStorage.removeItem(this.tokenKey); // Remove the token
    localStorage.removeItem('username'); // Remove the username
    this.isLoggedInSubject.next(false); // Update login status
    this.router.navigate(['/login']); // Redirect to login page
  }
}