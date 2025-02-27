import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})

export class ApiService {
    private baseUrl = 'http://127.0.0.1:8000/api';

    constructor(private http: HttpClient) { }

    private getHeaders(): HttpHeaders {
        const authToken = this.getAuthToken();

        return new HttpHeaders({
            Authorization: `Bearer ${authToken}`,
        });
    }

    get<T>(endpoint: string): Observable<T> {
        return this.http.get<T>(`${this.baseUrl}/${endpoint}`, {
            headers: this.getHeaders(),
        });
    }

    post<T>(endpoint: string, body: any): Observable<T> {
        return this.http.post<T>(`${this.baseUrl}/${endpoint}`, body, {
            headers: this.getHeaders(),
        });
    }
    
    postFormData<T>(endpoint: string, formData: FormData): Observable<T> {
        return this.http.post<T>(`${this.baseUrl}/${endpoint}`, formData, {
            headers: this.getHeaders(),
        });
    }

    put<T>(endpoint: string, body: any): Observable<T> {
        return this.http.put<T>(`${this.baseUrl}/${endpoint}`, body, {
            headers: this.getHeaders(),
        });
    }

    delete<T>(endpoint: string): Observable<T> {
        return this.http.delete<T>(`${this.baseUrl}/${endpoint}`, {
            headers: this.getHeaders(),
        });
    }

    getAuthToken(): string | null {
        const encodedToken = localStorage.getItem('authToken');
        if (encodedToken) {
            const decodedToken = atob(encodedToken); // Decode from base64
            return decodedToken;

        }
        return null;
    }
}