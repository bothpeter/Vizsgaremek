import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})

export class FoodService {
    constructor(private apiService: ApiService) { }

    getFoods(): Observable<any> {
        return this.apiService.get('food');
    }

    getFood(foodId: number): Observable<any> {
        return this.apiService.get(`food/${foodId}`);
    }

    getLikedFoods(): Observable<any> {
        return this.apiService.get('user_like_food');
    }

    toggleLike(foodId: number, isLiked: boolean): Observable<any> {
        const endpoint = `user_like_food/${foodId}`;
        return isLiked
            ? this.apiService.delete(endpoint)
            : this.apiService.post('user_like_food', { food_id: foodId });
    }

    addFood(formData: FormData): Observable<any> {
        return this.apiService.postFormData('food', formData);
    }

    getIngredients(foodId: number): Observable<any> {
        return this.apiService.get(`food_ingredients/${foodId}`);
    }

    getUploaderData(): Observable<any> {
        return this.apiService.get(`user`);
    }

    addIngredient(payload: any): Observable<any> {
        return this.apiService.post('food_ingredients', payload);
    }

    toggleMeal(foodId: number, date: string, isAdded: boolean): Observable<any> {
        const endpoint = `meals/${foodId}`;
        const payload = isAdded ? null : { food_id: foodId, date };
        return isAdded
            ? this.apiService.delete(endpoint)
            : this.apiService.post('meals', payload);
    }

    getMeals(): Observable<any> {
        return this.apiService.get('meals');
    }
}