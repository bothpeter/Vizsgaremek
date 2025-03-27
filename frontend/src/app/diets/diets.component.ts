import { Component, OnInit } from '@angular/core';
import { DietService } from '../services/diet.service';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginPopupComponent } from '../components/login-popup/login-popup.component';

@Component({
    selector: 'app-diets',
    standalone: true,
    imports: [CommonModule, FormsModule, LoginPopupComponent],
    templateUrl: './diets.component.html',
    styleUrls: ['./diets.component.css'],
})

export class DietsComponent implements OnInit {
    diets: any[] = [];
    ingredients: any[] = [];
    allFoods: any[] = [];
    foods: any[] = [];
    uploaderData: any = null;
    selectedDiet: any = null;
    selectedFood: any = null;
    showPopup: boolean = false;
    showLoginPopup: boolean = false;
    showFoodPopup: boolean = false;
    loading: boolean = false;
    searchQuery = '';

    showAddDietPopup: boolean = false;
    newDiet: any = {
        title: '',
        description: '',
        foods: [{ food_id: null }],
    };

    constructor(private dietService: DietService, private authService: AuthService) { }

    ngOnInit(): void {
        this.fetchDiets();
        this.fetchAllFoods();
    }

    fetchUploaderData(): void {
        this.dietService.getUploaderData().subscribe({
            next: (data) => {
                const filteredUsers = data.users.filter((user: any) => user.id === this.selectedDiet.user_id);
                this.uploaderData = filteredUsers.length > 0 ? filteredUsers[0] : null;
                this.showPopup = true;
            },
            error: (error) => console.error('Error fetching uploader data:', error),
        });
    }

    fetchDiets(): void {
        this.loading = true;
        this.dietService.getDiets().subscribe({
            next: (data) => {
                this.diets = data.workout_plan;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error fetching diets:', error);
                this.loading = false;
            }
        });
    }

    fetchAllFoods(): void {
        this.dietService.getFoods().subscribe({
            next: (data) => (this.allFoods = data.food),
            error: (error) => console.error('Error fetching foods:', error),
        });
    }

    fetchIngredients(foodId: number): void {
        this.dietService.getIngredients(foodId).subscribe({
            next: (data) => {
                this.showFoodPopup = true;
                this.ingredients = data.ingredients
            },
            error: (error) => console.error('Error fetching ingredients:', error),
        });
    }

    addDiet(): void {
        if (!this.authService.isAuthenticated()) {
            alert('Kérjük, jelentkezzen be az étrend hozzáadásához!');
            return;
        }

        const selectedFoods = this.newDiet.foods.map((food: any) =>
            Number(food.food_id)
        );
        
        const calorieValues = selectedFoods.map((id: number) => {
            const food = this.allFoods.find((f) => f.food_id === id);
            return food ? food.calorie : 0;
        });

        const totalKcal = calorieValues.reduce(
            (sum: number, calorie: number) => sum + calorie,
            0
        );

        const payload = {
            title: this.newDiet.title,
            description: this.newDiet.description,
            foods: 'idk what to send here',
            kcal: totalKcal,
            food1_id: selectedFoods[0] || null,
            food2_id: selectedFoods[1] || null,
            food3_id: selectedFoods[2] || null,
        };

        this.dietService.addDiet(payload).subscribe({
            next: () => {
                this.fetchDiets();
                this.closeAddDietPopup();
            },
            error: (error) => console.error('Error adding diet:', error),
        });
    }

    openAddDietPopup(): void {
        if (!this.authService.isAuthenticated()) {
            this.openLoginPopup();
            return;
        }
        this.showAddDietPopup = true;
    }

    closeAddDietPopup(): void {
        this.showAddDietPopup = false;
        this.resetNewDietForm();
    }

    resetNewDietForm(): void {
        this.newDiet = {
            title: '',
            description: '',
            foods: [{ food_id: null }],
        };
    }

    openPopup(diet: any): void {
        this.selectedDiet = diet;
        this.fetchFoods([diet.food1_id, diet.food2_id, diet.food3_id]);
        this.fetchUploaderData();
    }

    closePopup(): void {
        this.showPopup = false;
        this.selectedDiet = null;
        this.foods = [];
    }

    openLoginPopup(): void {
        this.showLoginPopup = true;
    }

    closeLoginPopup(): void {
        this.showLoginPopup = false;
    }

    fetchFoods(foodIds: number[]): void {
        this.foods = this.allFoods.filter((food) =>
            foodIds.includes(food.food_id)
        );
    }

    openFoodPopup(food: any): void {
        this.selectedFood = food;
        this.fetchIngredients(food.food_id);
    }

    closeFoodPopup(): void {
        this.showFoodPopup = false;
        this.selectedFood = null;
        this.ingredients = [];
    }

    addFood(): void {
        if (this.newDiet.foods.length < 3) {
            this.newDiet.foods.push({ food_id: null });
        }
    }

    removeFood(index: number): void {
        if (this.newDiet.foods.length > 1) {
            this.newDiet.foods.splice(index, 1);
        }
    }

    get searchDiets() {
        return this.diets.filter(diet => {
            const matchesSearch = diet.title.toLowerCase().includes(this.searchQuery.toLowerCase());
            return matchesSearch;
        });
    }

    clearSearch() {
        this.searchQuery = '';
    }
}