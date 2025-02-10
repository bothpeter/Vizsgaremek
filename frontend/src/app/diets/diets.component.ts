import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-diets',
  standalone: true,
  imports: [CommonModule],
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

  constructor() {}

  ngOnInit(): void {
    this.fetchDiets();
  }

  fetchDiets(): void {
    const apiUrl = 'http://127.0.0.1:8000/api/diet_plan';
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        this.diets = data.workout_plan;
      })
      .catch((error) => {
        console.error('Error fetching diets:', error);
      });
  }

  openPopup(diet: any): void {
    this.selectedDiet = diet;
    this.showPopup = true;
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
        this.foods = data.food.filter((food: any) => foodIds.includes(food.id));
      })
      .catch((error) => {
        console.error('Error fetching foods:', error);
      });
  }

  openFoodPopup(food: any): void {
    this.selectedFood = food;
    this.showFoodPopup = true;
    this.fetchIngredients(food.id);
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
        this.ingredients = data.ingredients;
      })
      .catch((error) => {
        console.error('Error fetching ingredients:', error);
      });
  }
}