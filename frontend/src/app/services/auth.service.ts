import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

export interface User {
    id: string;
    name: string;
    email: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface LoginCredentials {
    login: string;
    password: string;
}

@Injectable({
    providedIn: 'root',
})

export class AuthService {
    private tokenKey = 'authToken';
    private userKey = 'userData';

    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    public authStateChanged = new EventEmitter<boolean>();

    constructor(private router: Router, private apiService: ApiService) {
        this.checkAuthStatus();
    }

    private checkAuthStatus(): void {
        const userData = this.getUserData();
        if (userData) {
            this.currentUserSubject.next(userData);
        }
    }

    getAuthToken(): string | null {
        const token = localStorage.getItem(this.tokenKey);
        return token;
    }

    getUserData(): User | null {
        const userJson = localStorage.getItem(this.userKey);
        if (userJson) {
            try {
                return JSON.parse(userJson);
            } catch (e) {
                this.clearAuthData();
                return null;
            }
        }
        return null;
    }

    attemptLogin(credentials: LoginCredentials): Observable<boolean> {
        return this.apiService.post<AuthResponse>('login', credentials).pipe(
            tap(response => this.handleLoginSuccess(response)),
            map(() => true),
            catchError(error => this.handleAuthError(error))
        );
    }

    private handleLoginSuccess(response: AuthResponse): void {
        if (!response || !response.token || !response.user) {
            throw new Error('Invalid authentication response');
        }

        const { token, user } = response;

        this.storeAuthData(token, user);

        this.currentUserSubject.next(user);
        this.authStateChanged.emit(true);

        this.router.navigateByUrl('/');
    }

    private storeAuthData(token: string, user: User): void {
        localStorage.setItem(this.tokenKey, token);
        const userData = { name: user.name, email: user.email };
        localStorage.setItem(this.userKey, JSON.stringify(userData));
    }

    private clearAuthData(): void {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
        this.currentUserSubject.next(null);
        this.authStateChanged.emit(false);
    }

    logout(): Observable<boolean> {
        const authToken = this.getAuthToken();

        if (!authToken) {
            this.clearAuthData();
            this.router.navigateByUrl('/login');
            return of(true);
        }

        return this.apiService.post('logout', {}).pipe(
            tap(() => {
                this.clearAuthData();
                this.router.navigateByUrl('/login');
            }),
            map(() => true),
            catchError(error => {
                console.error('Logout failed:', error);
                this.clearAuthData();
                this.router.navigateByUrl('/login');
                return of(true);
            })
        );
    }

    isAuthenticated(): boolean {
        return !!this.getAuthToken() && !!this.currentUserSubject.value;
    }

    deleteUser(): Observable<boolean> {
        const authToken = this.getAuthToken();

        if (!authToken) {
            return throwError(() => new Error('Nincs bejelentkezett felhasználó!'));
        }

        return this.apiService.delete('user').pipe(
            tap(() => {
                this.clearAuthData();
                this.router.navigateByUrl('/login');
            }),
            map(() => true),
            catchError(error => {
                console.error('User deletion failed:', error);
                return throwError(() => new Error('Felhasználó törlése sikertelen!'));
            })
        );
    }

    private handleAuthError(error: HttpErrorResponse): Observable<never> {
        let errorMessage = 'Hiba történt a bejelentkezés során. Kérjük, próbáld újra később.';

        if (error.status === 401) {
            errorMessage = "Hibás email, név vagy jelszó.";
        } else if (error.status === 403) {
            errorMessage = "Nincs jogosultsága a művelethez.";
        } else if (error.status === 0) {
            errorMessage = "Nincs kapcsolat a szerverrel. Ellenőrizze az internetkapcsolatot.";
        }

        return throwError(() => new Error(errorMessage));
    }
}