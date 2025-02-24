import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})

export class ExerciseService {
    constructor(private apiService: ApiService) { }

    getExercises(): Observable<any> {
        return this.apiService.get('exercise');
    }

    getLikedExercises(): Observable<any> {
        return this.apiService.get('user_like_exercise');
    }

    toggleLike(exerciseId: number, isLiked: boolean): Observable<any> {
        const endpoint = `user_like_exercise/${exerciseId}`;
        return isLiked
            ? this.apiService.delete(endpoint)
            : this.apiService.post('user_like_exercise', { exercise_id: exerciseId });
    }

    addExercise(formData: FormData): Observable<any> {
        return this.apiService.postFormData('exercise', formData);
    }
}