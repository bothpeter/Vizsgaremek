import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})

export class WorkoutService {
    constructor(private apiService: ApiService) { }

    getWorkouts(): Observable<any> {
        return this.apiService.get('workout_plan');
    }

    addWorkout(payload: any): Observable<any> {
        return this.apiService.post('workout_plan', payload);
    }

    getUploaderData(): Observable<any> {
        return this.apiService.get(`user`);
    }

    getExercises(): Observable<any> {
        return this.apiService.get('exercise');
    }
}