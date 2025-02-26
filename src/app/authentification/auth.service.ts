import { Router, ActivatedRoute } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  private apiUrl = environment.apiUrl + '/auth'; // Base URL for authentication endpoints
  private tokenKey = 'authToken'; // Key for storing the JWT token in localStorage

  constructor(private router: Router, private activateRoute: ActivatedRoute, private http: HttpClient) {
    this.isLoggedInSubject.next(this.isLoggedIn());
  }

  // Login method
  login(username: string, password: string): Observable<any> {
    const payload = { username, password };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(`${this.apiUrl}/login`, payload, { headers, responseType: 'text' }).pipe(
      tap({
        next: (response: string) => {
          if (response) {
            localStorage.setItem(this.tokenKey, response);
            localStorage.setItem('username', username);
            this.isLoggedInSubject.next(true); // Update login status
            const returnUrl = this.activateRoute.snapshot.queryParams['returnUrl'] || '/jokes';
            this.router.navigateByUrl(returnUrl);
          }
        },
        error: (err) => {
          console.error('Login failed:', err);
          // Optionally, show a user-friendly error message
        },
      })
    );
  }

  // Registration method
  register(username: string, password: string): Observable<string> {
    const payload = { username, password };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(`${this.apiUrl}/register`, payload, { headers, responseType: 'text' }).pipe(
      tap({
        error: (err) => {
          console.error('Registration failed:', err);
          // Optionally, show a user-friendly error message
        },
      })
    );
  }

  // Check if the user is logged in
  isLoggedIn(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    console.log("token : ", token);
    console.log("islogiedintest : ", !!token && !this.isTokenExpired(token));
    return !!token && !this.isTokenExpired(token); // Check if token exists and is not expired
  }

  // Get the connected username
  getConnectedUsername(): string | null {
    return localStorage.getItem('username');
  }

  // Get the JWT token
  getToken(): string | null {
    const token = localStorage.getItem(this.tokenKey);
    if (token && this.isTokenExpired(token)) {
      this.logout();
      return null;
    }
    return token;
  }

  // Logout method
  logout(): void {
    localStorage.removeItem(this.tokenKey); // Remove the token
    localStorage.removeItem('username'); // Remove the username
    this.isLoggedInSubject.next(false); // Update login status
    this.router.navigate(['/jokes']); // Redirect to login page
  }

  // Check if the token is expired
  private isTokenExpired(token: string): boolean {
    const payload = JSON.parse(atob(token.split('.')[1])); // Decode the token payload
    return payload.exp < Date.now() / 1000; // Check if the token is expired
  }

    // Decode the JWT token
    private decodeToken(token: string): any {
      try {
        const payload = token.split('.')[1]; // Get the payload part of the token
        const decodedPayload = atob(payload); // Decode the base64 payload
        return JSON.parse(decodedPayload); // Parse the JSON payload
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
  
    // Get roles from the JWT token
    getRoles(): string[] {
      const token = this.getToken();
      if (token) {
        const payload = this.decodeToken(token);
        return payload.roles || []; // Assuming roles are stored in the 'roles' claim
      }
      return [];
    }
}