import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FoodService } from '../services/food.service';
import { ApiService } from '../services/api.service';
import { forkJoin } from 'rxjs';
import { LoginPopupComponent } from '../components/login-popup/login-popup.component';

@Component({
    selector: 'app-calorie-counter',
    standalone: true,
    imports: [CommonModule, RouterModule, LoginPopupComponent],
    templateUrl: './calorie-counter.component.html',
    styleUrls: ['./calorie-counter.component.css'],
})
export class CalorieCounterComponent implements OnInit {
    userPhysique: any = null;
    meals: any[] = [];
    ingredients: any[] = [];
    totalCaloriesConsumed: number = 0;
    selectedFood: any = null;
    loading: boolean = false;

    showPopup: boolean = false;
    showPhysiquePopup: boolean = false;
    showLoginPopup: boolean = false;

    isGoalReached: boolean = false;

    confettiPieces: ConfettiPiece[] = [];
    showConfetti: boolean = false;
    progressWidth: number = 0;

    constructor(private foodService: FoodService, private apiService: ApiService) { }

    ngOnInit(): void {
        this.fetchUserPhysique();
        this.fetchMeals();
        this.generateConfettiData();
    }

    fetchUserPhysique(): void {
        if (!this.apiService.getAuthToken()) {
            this.showLoginPopup = true;
            return;
        };

        this.apiService.get('user_physique').subscribe({
            next: (res: any) => {
                if (res.status === 200 && res.UserPhysique.length > 0) {
                    this.userPhysique = res.UserPhysique[0];
                } else {
                    this.showPhysiquePopup = true;
                }
            },
            error: (error) => {
                console.error('Error fetching userPhysique:', error);
            }
        });
    }

    fetchMeals(): void {
        this.loading = true;
        this.foodService.getMeals().subscribe({
            next: (res: any) => this.handleMealsResponse(res),
            error: (error) => this.handleMealsError(error)
        });
    }

    handleMealsResponse(res: any): void {
        if (res.status === 200 && Array.isArray(res.Meals)) {
            if (res.Meals.length === 0) {
                this.loading = false;
                return;
            }

            const mealDetailsObservables = res.Meals.map((meal: any) =>
                this.foodService.getFood(meal.food_id)
            );

            forkJoin<any[]>(mealDetailsObservables).subscribe({
                next: (responses: any[]) => this.handleMealDetailsResponses(responses),
                error: (error) => this.handleMealDetailsError(error)
            });
        } else {
            console.error('Invalid meals response:', res);
            this.loading = false;
        }
    }

    handleMealDetailsResponses(responses: any[]): void {
        responses.forEach((response: any) => {
            if (response.status === 200 && response.food && response.food.length > 0) {
                const food = response.food[0];
                this.meals.push({ ...food });
            } else {
                console.error('Invalid food details response:', response);
            }
        });
        this.calculateTotalCalories();
        this.loading = false;
    }

    handleMealsError(error: any): void {
        this.loading = false;
        console.error('Error fetching meals:', error);
    }

    handleMealDetailsError(error: any): void {
        this.loading = false;
        console.error('Error fetching meal details:', error);
    }

    calculateTotalCalories(): void {
        this.totalCaloriesConsumed = this.meals.reduce((total, meal) => total + meal.calorie, 0);
        this.progressWidth = (this.totalCaloriesConsumed / this.userPhysique?.daily_calorie_intake) * 100;

        if (this.totalCaloriesConsumed >= this.userPhysique?.daily_calorie_intake && !this.isGoalReached) {
            this.isGoalReached = true;
            this.showConfetti = true;
            setTimeout(() => {
                this.showConfetti = false;
            }, 5000);
        }
    }

    fetchIngredients(foodId: number): void {
        this.foodService.getIngredients(foodId).subscribe({
            next: (data: any) => {
                this.ingredients = data.ingredients;
                this.showPopup = true;
            },
            error: (error) => {
                console.error('Error fetching ingredients:', error);
            }
        });
    }

    openPopup(food: any): void {
        this.selectedFood = food;
        this.fetchIngredients(food.food_id);
    }

    closePopup(): void {
        this.showPopup = false;
        this.selectedFood = null;
        this.ingredients = [];
    }

    openLoginPopup(): void {
        this.showLoginPopup = true;
    }

    closeLoginPopup(): void {
        this.showLoginPopup = false;
    }

    getRandomPosition(): string {
        return `${Math.random() * 100}vw`;
    }

    getRandomDelay(): string {
        return `${Math.random() * 2}s`
    }

    getRandomColor(): string {
        const colors = ['#ffcc00', '#ff6666', '#66ccff', '#99ff99', '#ff9966'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    generateConfettiData(): void {
        this.confettiPieces = Array(300).fill(null).map(() => ({
            left: `${Math.random() * 100}vw`,
            delay: `${Math.random() * 2}s`,
            color: this.getRandomColor(),
        }));
    }

    deleteFood(foodId: number): void {
        this.apiService.delete(`meals/${foodId}`).subscribe({
            next: () => {
                const deletedMeal = this.meals.find((meal) => meal.food_id === foodId);
                this.meals = this.meals.filter((meal) => meal.food_id !== foodId);

                this.totalCaloriesConsumed -= deletedMeal.calorie;

                this.progressWidth = (this.totalCaloriesConsumed / this.userPhysique?.daily_calorie_intake) * 100;
            },
            error: (error) => {
                console.error('Error deleting meal:', error);
            },
        });
    }

}

interface ConfettiPiece {
    left: string;
    delay: string;
    color: string;
}