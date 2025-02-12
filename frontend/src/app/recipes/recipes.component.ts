import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { sortFoodsPipe } from '../pipes/sort-foods.pipe';

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [CommonModule, sortFoodsPipe],
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
})
export class RecipesComponent implements OnInit {
  food: any[] = [];
  selectedFood: any = null;
  ingredients: any[] = [];
  showPopup: boolean = false;
  selectedType: string = 'all';

  constructor() {}

  ngOnInit(): void {
    this.fetchFood();
  }

  fetchFood(): void {
    const apiUrl = 'http://127.0.0.1:8000/api/food';
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        this.food = data.food;
      })
      .catch((error) => {
        console.error('Error fetching food:', error);
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
      this.showPopup = true;
      this.ingredients = data.ingredients;
    })
    .catch((error) => {
      console.error('Error fetching ingredients:', error);
    });
  }

  changeType(type: string): void {
    this.selectedType = type;
  }
}