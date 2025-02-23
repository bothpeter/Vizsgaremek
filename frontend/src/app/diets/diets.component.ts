import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-diets',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './diets.component.html',
    styleUrls: ['./diets.component.css']
})
export class DietsComponent implements OnInit {
    diets: any[] = [];
    selectedDiet: any = null;
    foods: any[] = [];
    showPopup: boolean = false;
    selectedFood: any = null;
    showFoodPopup: boolean = false;
    ingredients: any[] = [];
    showAddDietPopup: boolean = false;
    allFoods: any[] = [];
    newDiet: any = {
        title: '',
        description: '',
        foods: [{ food_id: null }],
    };

    constructor(private http: HttpClient) { }

    ngOnInit(): void {
        this.fetchDiets();
        this.fetchAllFoods();
    }

    fetchDiets(): void {
        const apiUrl = 'http://127.0.0.1:8000/api/diet_plan';
        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                this.diets = data.workout_plan;
            })
            .catch((error) => {
                console.error('Error fetching diets:', error);
            });
    }

    fetchAllFoods(): void {
        const apiUrl = 'http://127.0.0.1:8000/api/food';
        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                this.allFoods = data.food;
            })
            .catch((error) => {
                console.error('Error fetching foods:', error);
            });
    }

    openAddDietPopup(): void {
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

    addDiet(): void {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            alert('Kérjük, jelentkezz be az új étrend hozzáadásához!');
            return;
        }
    
        const selectedFoods = this.newDiet.foods.map((food: any) => Number(food.food_id));
    
        const calorieValues = selectedFoods.map((id: number) => {
            const food = this.allFoods.find((f) => f.food_id === id);
            return food ? food.calorie : 0;
        });
    
        const totalKcal = calorieValues.reduce((sum: number, calorie: number) => sum + calorie, 0);

        const payload = {
            title: this.newDiet.title,
            description: this.newDiet.description,
            foods: 'idk what to send here',
            kcal: totalKcal,
            food1_id: selectedFoods[0] || null,
            food2_id: selectedFoods[1] || null,
            food3_id: selectedFoods[2] || null,
        };
    
        this.http.post('http://127.0.0.1:8000/api/diet_plan', payload, {
            headers: { Authorization: `Bearer ${authToken}` }
        })
            .subscribe(
                (response) => {
                    this.fetchDiets();
                    this.closeAddDietPopup();
                },
                (error) => {
                    console.error('Error adding diet:', error);
                }
            );
    }
    openPopup(diet: any): void {
        this.selectedDiet = diet;
        this.fetchFoods([diet.food1_id, diet.food2_id, diet.food3_id]);
    }

    closePopup(): void {
        this.showPopup = false;
        this.selectedDiet = null;
        this.foods = [];
    }

    fetchFoods(foodIds: number[]): void {
        const apiUrl = 'http://127.0.0.1:8000/api/food';
        fetch(apiUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                this.showPopup = true;
                this.foods = data.food.filter((food: any) => foodIds.includes(food.food_id));
            })
            .catch((error) => {
                console.error('Error fetching foods:', error);
            });
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

    fetchIngredients(foodId: number): void {
        const apiUrl = `http://127.0.0.1:8000/api/food_ingredients/${foodId}`;
        fetch(apiUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                this.showFoodPopup = true;
                this.ingredients = data.ingredients;
            })
            .catch((error) => {
                console.error('Error fetching ingredients:', error);
            });
    }
}