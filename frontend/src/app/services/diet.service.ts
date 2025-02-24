import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})

export class DietService {
    constructor(private apiService: ApiService) { }

    getDiets(): Observable<any> {
        return this.apiService.get('diet_plan');
    }

    addDiet(payload: any): Observable<any> {
        return this.apiService.post('diet_plan', payload);
    }

    getFoods(): Observable<any> {
        return this.apiService.get('food');
    }

    getIngredients(foodId: number): Observable<any> {
        return this.apiService.get(`food_ingredients/${foodId}`);
    }
}