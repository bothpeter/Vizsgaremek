import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root',
})

export class AuthService {
    private isLoggedIn = false;

    constructor(private router: Router, private apiService: ApiService) { }

    getAuthToken(): string | null {
        return localStorage.getItem('authToken');
    }

    login(token: string, userId: string, userName: string, userEmail: string) {
        this.isLoggedIn = true;
        localStorage.setItem('authToken', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('userName', userName);
        localStorage.setItem('userEmail', userEmail);
    }

    logout() {
        const authToken = this.getAuthToken();
        if (authToken) {
            this.apiService.post('logout', {}).subscribe({
                next: () => {
                    this.isLoggedIn = false;
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('userId');
                    localStorage.removeItem('userName');
                    localStorage.removeItem('userEmail');
                    this.router.navigateByUrl('/login');
                },
                error: (error) => {
                    console.error('Logout failed:', error);
                    alert('Kijelentkezés sikertelen!');
                },
            });
        } else {
            this.isLoggedIn = false;
            this.router.navigateByUrl('/login');
        }
    }

    isAuthenticated(): boolean {
        return !!this.getAuthToken();
    }
}