import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class RegisterService {

    constructor(private apiService: ApiService) { }

    register(userData: any): Observable<any> {
        return new Observable((observer) => {
            this.apiService.post('register', userData).subscribe({
                next: (response) => {
                    observer.next(response);
                    observer.complete();
                },
                error: (error) => {
                    if (error.status === 422 && error.error) {
                        observer.error(error.error);
                    } else {
                        alert('Hiba történt a regisztráció során. Kérjük, próbáld újra később.');
                        observer.error(new Error('Hiba történt a regisztráció során.'));
                    }
                }
            });
        });
    }
}