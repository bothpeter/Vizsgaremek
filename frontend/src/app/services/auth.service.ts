// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedIn = false;

  constructor(private http: HttpClient, private router: Router) {}

  login(token: string) {
    this.isLoggedIn = true;
    localStorage.setItem('authToken', token);
  }

  logout() {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      this.http.post('http://127.0.0.1:8000/api/logout', {}, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }).subscribe({
        next: () => {
          this.isLoggedIn = false;
          localStorage.removeItem('authToken');
          this.router.navigateByUrl('/login');
          alert('Sikeres kijelentkezés!');
        },
        error: (err) => {
          console.error('Logout failed:', err);
          alert('Kijelentkezés sikertelen!');
        },
      });
    } else {
      this.isLoggedIn = false;
      this.router.navigateByUrl('/login');
    }
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn || !!localStorage.getItem('authToken');
  }
}