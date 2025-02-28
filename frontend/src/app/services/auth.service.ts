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
        const encodedToken = localStorage.getItem('authToken');
        if (encodedToken) {
            const decodedToken = atob(encodedToken); // Decode from base64
            return decodedToken;
        }
        return null;
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

    deleteUser(): void {
        const authToken = this.getAuthToken();
        if (authToken) {
            this.apiService.delete('user').subscribe({
                next: () => {
                    alert('Felhasználó sikeresen törölve!');
                },
                error: (error) => {
                    console.error('User deletion failed:', error);
                    alert('Felhasználó törlése sikertelen!');
                },
            });

            this.isLoggedIn = false;
            localStorage.removeItem('authToken');
            localStorage.removeItem('userId');
            localStorage.removeItem('userName');
            localStorage.removeItem('userEmail');
            this.router.navigateByUrl('/login');
        } else {
            alert('Nincs bejelentkezett felhasználó!');
        }
    }
}
