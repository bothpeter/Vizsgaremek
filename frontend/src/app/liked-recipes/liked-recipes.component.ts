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
    uploaderData: any = null;
    selectedFood: any = null;
    showPopup: boolean = false;
    errorMessage: string = '';
    loading: boolean = false;
    selectedFoodUploader: any = null;
    selectedFoodIngredients: any[] = [];

    constructor(private foodService: FoodService) { }

    ngOnInit(): void {
        this.fetchUploaderData();
        this.fetchIngredients();
        this.fetchLikedFoods();
    }

    fetchUploaderData(): void {
        this.foodService.getUploaderData().subscribe({
            next: (data) => {
                this.uploaderData = data.users;
            },
            error: (error) => console.error('Error fetching uploader data:', error),
        });
    }

    fetchLikedFoods(): void {
        this.loading = true;
        this.foodService.getLikedFoods().subscribe({
            next: (res: any) => this.handleLikedFoodsResponse(res),
            error: (error) => this.handleLikedFoodsError(error)
        });
    }

    handleLikedFoodsResponse(res: any): void {
        if (res.status === 200 && Array.isArray(res.UserLikeFood)) {
            if (res.UserLikeFood.length === 0) {
                this.loading = false;
                return;
            }

            const foodDetailsObservables = res.UserLikeFood.map((item: any) =>
                this.foodService.getFood(item.food_id)
            );

            forkJoin<any[]>(foodDetailsObservables).subscribe({
                next: (responses: any[]) => this.handleFoodDetailsResponses(responses),
                error: (error) => this.handleFoodDetailsError(error)
            });
        } else {
            console.error('Invalid liked foods response:', res);
            this.loading = false;
        }
    }

    handleFoodDetailsResponses(responses: any[]): void {
        responses.forEach((response: any) => {
            if (response.status === 200 && response.food && response.food.length > 0) {
                const food = response.food[0];
                this.likedFoods.push({ ...food, isLiked: true });
            } else {
                console.error('Invalid food details response:', response);
            }
        });
        this.loading = false;
    }

    handleLikedFoodsError(error: any): void {
        console.error('Error fetching liked foods:', error);
        this.loading = false;
    }

    handleFoodDetailsError(error: any): void {
        console.error('Error fetching food details:', error);
        this.loading = false;
    }

    toggleLike(food: any): void {
        const wasLiked = food.isLiked;
        food.isLiked = !wasLiked;

        if (wasLiked) {
            this.likedFoods = this.likedFoods.filter(item => item.food_id !== food.food_id);
        } else {
            this.likedFoods = [...this.likedFoods, food];
        }

        this.foodService.toggleLike(food.food_id, wasLiked).subscribe({
            error: (error) => {
                console.error('Error toggling like:', error);
                food.isLiked = wasLiked;
                if (wasLiked) {
                    this.likedFoods = [...this.likedFoods, food];
                } else {
                    this.likedFoods = this.likedFoods.filter(item => item.food_id !== food.food_id);
                }
            }
        });
    }

    fetchIngredients(): void {
        this.foodService.getIngredients().subscribe({
            next: (data) => {
                this.ingredients = data.ingredients;
            },
            error: (error) => {
                console.error('Error fetching ingredients:', error);
            }
        });
    }


    openPopup(food: any): void {
        this.selectedFood = food;

        if (this.uploaderData) {
            this.selectedFoodUploader = this.uploaderData.find(
                (user: any) => user.id === this.selectedFood.user_id
            );
        }

        this.selectedFoodIngredients = this.ingredients.filter(
            (ingredient: any) => ingredient.food_id === this.selectedFood.food_id
        );


        this.showPopup = true;
    }

    closePopup(): void {
        this.showPopup = false;
        this.selectedFood = null;
    }
}