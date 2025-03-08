import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export interface RegisterError {
    message?: string;
    name?: string;
    email?: string;
    password?: string;
}

@Injectable({
    providedIn: 'root',
})

export class RegisterService {
    constructor(private apiService: ApiService) { }

    register(userData: RegisterData): Observable<any> {
        return this.apiService.post('register', userData).pipe(
            map(response => response),
            catchError(error => {
                let errorResponse: RegisterError = {};

                if (error.status === 422 && error.error) {
                    errorResponse = error.error;
                } else {
                    errorResponse = {
                        message: 'Hiba történt a regisztráció során. Kérjük, próbáld újra később.'
                    };
                }

                return throwError(() => errorResponse);
            })
        );
    }
}