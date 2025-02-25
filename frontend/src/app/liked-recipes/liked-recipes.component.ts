import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FoodService } from '../services/food.service';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-liked-recipes',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './liked-recipes.component.html',
    styleUrls: ['./liked-recipes.component.css'],
})

export class LikedRecipesComponent implements OnInit {
    ingredients: any[] = [];
    likedFoods: any[] = [];
    selectedFood: any = null;
    showPopup: boolean = false;
    errorMessage: string = '';

    constructor(private foodService: FoodService) { }

    ngOnInit(): void {
        this.fetchLikedFoods();
    }

    fetchLikedFoods(): void {
        this.foodService.getLikedFoods().subscribe({
            next: (res: any) => {
                if (res.status === 200 && Array.isArray(res.UserLikeFood)) {
                    const foodDetailsObservables = res.UserLikeFood.map((item: any) =>
                        this.foodService.getFood(item.food_id)
                    );

                    forkJoin<any[]>(foodDetailsObservables).subscribe({
                        next: (responses: any[]) => {
                            responses.forEach((response: any) => {
                                if (response.status === 200 && response.food && response.food.length > 0) {
                                    const food = response.food[0];
                                    this.likedFoods.push({ ...food, isLiked: true });
                                } else {
                                    console.error('Invalid food details response:', response);
                                }
                            });
                        },
                        error: (error) => {
                            console.error('Error fetching food details:', error);
                        }
                    });
                } else {
                    console.error('Invalid liked foods response:', res);
                }
            },
            error: (error) => {
                console.error('Error fetching liked foods:', error);
            }
        });
    }

    fetchFoodDetails(foodId: number): void {
        this.foodService.getFood(foodId).subscribe({
            next: (response: any) => {
                if (response.status === 200 && response.food && response.food.length > 0) {
                    const food = response.food[0];
                    this.likedFoods.push({ ...food, isLiked: true });
                } else {
                    console.error('Invalid food details response:', response);
                }
            },
            error: (error) => {
                console.error('Error fetching food details:', error);
            }
        });
    }

    toggleLike(food: any): void {
        this.foodService.toggleLike(food.food_id, food.isLiked).subscribe({
            next: () => {
                food.isLiked = !food.isLiked;
                if (!food.isLiked) {
                    this.likedFoods = this.likedFoods.filter((item) => item.food_id !== food.food_id);
                }
            },
            error: (error) => {
                console.error('Error toggling like:', error);
            }
        });
    }

    fetchIngredients(foodId: number): void {
        this.foodService.getIngredients(foodId).subscribe({
            next: (data: any) => {
                this.showPopup = true;
                this.ingredients = data.ingredients;
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
}