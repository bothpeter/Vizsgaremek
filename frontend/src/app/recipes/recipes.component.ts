import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchFood();
    this.fetchLikedFoods();
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

fetchLikedFoods(): void {
  const authToken = localStorage.getItem('authToken');
  if (!authToken) return;

  const apiUrl = 'http://127.0.0.1:8000/api/user_like_food';
  this.http.get(apiUrl, { headers: { Authorization: `Bearer ${authToken}` } })
    .subscribe(
      (data: any) => {
        // Ellenőrizd, hogy a válasz tartalmazza a UserLikeFood tömböt
        if (data && data.UserLikeFood && Array.isArray(data.UserLikeFood)) {
          const likedFoodIds = data.UserLikeFood.map((item: any) => item.food_id);
          this.food.forEach((food) => {
            food.isLiked = likedFoodIds.includes(food.food_id);
          });
        } else {
          console.error('Invalid response format:', data);
        }
      },
      (error) => {
        console.error('Error fetching liked foods:', error);
      }
    );
}

  toggleLike(food: any): void {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      alert('Kérjük, jelentkezz be a kedveléshez!');
      return;
    }

    if (food.isLiked) {
      // DELETE kérés, ha már kedvelt
      const apiUrl = `http://127.0.0.1:8000/api/user_like_food/${food.food_id}`;
      this.http.delete(apiUrl, { headers: { Authorization: `Bearer ${authToken}` } })
        .subscribe(
          () => {
            food.isLiked = false;
          },
          (error) => {
            console.error('Error unliking food:', error);
          }
        );
    } else {
      // POST kérés, ha még nem kedvelt
      const apiUrl = 'http://127.0.0.1:8000/api/user_like_food';
      const payload = { food_id: food.food_id };
      this.http.post(apiUrl, payload, { headers: { Authorization: `Bearer ${authToken}` } })
        .subscribe(
          () => {
            food.isLiked = true;
          },
          (error) => {
            console.error('Error liking food:', error);
          }
        );
    }
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