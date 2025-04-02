import { Component, OnInit } from '@angular/core';
import { FoodService } from '../services/food.service';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginPopupComponent } from '../components/login-popup/login-popup.component';

@Component({
    selector: 'app-recipes',
    standalone: true,
    imports: [CommonModule, FormsModule, LoginPopupComponent],
    templateUrl: './recipes.component.html',
    styleUrls: ['./recipes.component.css'],
})
export class RecipesComponent implements OnInit {
    foods: any[] = [];
    ingredients: any[] = [];
    uploaderData: any = null;
    selectedFood: any = null;
    selectedType: string = 'all';
    showPopup: boolean = false;
    showLoginPopup: boolean = false;
    searchQuery: string = '';
    loading: boolean = false;
    selectedFoodUploader: any = null;
    selectedFoodIngredients: any[] = [];

    showAddFoodPopup: boolean = false;
    newFood: any = {
        name: '',
        description: '',
        type: 'reggeli',
        calorie: 0,
        fat: 0,
        protein: 0,
        carb: 0,
        imgFile: null,
        recipe: '',
        ingredients: [{ ingredient_name: '', amount: '' }],
    };

    constructor(private foodService: FoodService, private authService: AuthService) { }

    ngOnInit(): void {
        this.fetchUploaderData();
        this.fetchIngredients();
        this.fetchFoods();
        this.fetchMeals();
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

    fetchFoods(): void {
        this.loading = true;
        this.foodService.getFoods().subscribe({
            next: (data) => {
                this.loading = false;
                this.foods = data.food;
            },
            error: (error) => {
                console.error('Error fetching food:', error);
                this.loading = false;
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

    fetchLikedFoods(): void {
        if (!this.authService.isAuthenticated()) return;

        this.foodService.getLikedFoods().subscribe({
            next: (data) => {
                const likedFoodIds = data.UserLikeFood.map((item: any) => item.food_id);
                this.foods.forEach((food) => {
                    food.isLiked = likedFoodIds.includes(food.food_id);
                });
            },
            error: (error) => console.error('Error fetching liked foods:', error),
        });
    }

    fetchMeals(): void {
        if (!this.authService.isAuthenticated()) return;

        this.foodService.getMeals().subscribe({
            next: (data) => {
                const mealFoodIds = data.Meals.map((meal: any) => meal.food_id);

                this.foods.forEach((food) => {
                    food.isAddedToMeal = mealFoodIds.includes(food.food_id);
                });
            },
            error: (error) => console.error('Error fetching meals:', error),
        });
    }

    toggleLike(food: any): void {
        if (!this.authService.isAuthenticated()) {
            this.openLoginPopup();
            return;
        }
    
        const wasLiked = food.isLiked;
        food.isLiked = !wasLiked;
    
        this.foodService.toggleLike(food.food_id, wasLiked).subscribe({
            error: (error) => {
                console.error('Error toggling like:', error);
                food.isLiked = wasLiked;
            }
        });
    }

    toggleMeal(food: any): void {
        if (!this.authService.isAuthenticated()) {
            this.openLoginPopup();
            return;
        }
    
        const wasAddedToMeal = food.isAddedToMeal;
        food.isAddedToMeal = !wasAddedToMeal;
    
        const date = new Date().toISOString().split('T')[0];
        this.foodService.toggleMeal(food.food_id, date, wasAddedToMeal).subscribe({
            error: (error) => {
                console.error('Error toggling meal:', error);
                food.isAddedToMeal = wasAddedToMeal;
            }
        });
    }


    addFood(): void {
        if (!this.authService.isAuthenticated()) {
            alert('Kérjük, jelentkezzen be a recept hozzáadásához!');
            return;
        }

        const formData = new FormData();
        Object.keys(this.newFood).forEach(key => {
            if (key === 'ingredients') return; // Skip ingredients for now
            formData.append(key, this.newFood[key]);
        });
        if (this.newFood.imgFile) {
            formData.append('img', this.newFood.imgFile);
        }

        this.foodService.addFood(formData).subscribe({
            next: (response: any) => {
                const newFoodId = response.food.food_id; // Get the ID of the new food

                // Send ingredients for the new food item
                this.newFood.ingredients.forEach((ingredient: any) => {
                    const ingredientPayload = {
                        food_id: newFoodId,
                        ingredient_name: ingredient.ingredient_name,
                        amount: ingredient.amount,
                    };

                    this.foodService.addIngredient(ingredientPayload).subscribe({
                        error: (error) => console.error('Error adding ingredient:', error),
                    });
                });

                this.fetchFoods();
                this.closeAddFoodPopup();
            },
            error: (error) => console.error('Error adding food:', error),
        });
    }

    openAddFoodPopup(): void {
        if (!this.authService.isAuthenticated()) {
            this.openLoginPopup();
            return;
        }
        this.showAddFoodPopup = true;
    }

    closeAddFoodPopup(): void {
        this.showAddFoodPopup = false;
        this.resetNewFoodForm();
    }

    resetNewFoodForm(): void {
        this.newFood = {
            name: '',
            description: '',
            type: 'reggeli',
            calorie: 0,
            fat: 0,
            protein: 0,
            carb: 0,
            imgFile: null,
            recipe: '',
            ingredients: [{ ingredient_name: '', amount: '' }],
        };
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

    openLoginPopup(): void {
        this.showLoginPopup = true;
    }

    closeLoginPopup(): void {
        this.showLoginPopup = false;
    }

    changeType(type: string): void {
        this.selectedType = type;
    }

    addIngredient(): void {
        this.newFood.ingredients.push({ ingredient_name: '', amount: '' });
    }

    removeIngredient(index: number): void {
        this.newFood.ingredients.splice(index, 1);
    }

    onFileSelected(event: any): void {
        const file = event.target.files[0];
        if (file) {
            this.newFood.imgFile = file;
        }
    }

    onDragOver(event: DragEvent): void {
        event.preventDefault();
    }

    onDrop(event: DragEvent): void {
        event.preventDefault();
        const file = event.dataTransfer?.files[0];
        if (file) {
            this.newFood.imgFile = file;
        }
    }

    get filteredFoods(): any[] {
        return this.foods.filter((food) => {
            const typeMatch = this.selectedType === 'all' || food.type === this.selectedType;
            const nameMatch = food.name.toLowerCase().includes(this.searchQuery.toLowerCase());
            return typeMatch && nameMatch;
        });
    }

    clearSearch() {
        this.searchQuery = '';
    }
}