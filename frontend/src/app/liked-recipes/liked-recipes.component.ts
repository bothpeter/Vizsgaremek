import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { VerticalNavUserComponent } from '../components/vertical-nav-user/vertical-nav-user.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-liked-recipes',
  standalone: true,
  imports: [CommonModule, RouterModule, VerticalNavUserComponent],
  templateUrl: './liked-recipes.component.html',
  styleUrls: ['./liked-recipes.component.css'],
})
export class LikedRecipesComponent implements OnInit {
  likedFoods: any[] = [];
  selectedFood: any = null;
  ingredients: any[] = [];
  showPopup: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchLikedFoods();
  }

  fetchLikedFoods(): void {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      alert('Kérjük, jelentkezz be a kedvenc ételek megtekintéséhez!');
      return;
    }
  
    const apiUrl = 'http://127.0.0.1:8000/api/user_like_food';
    this.http.get(apiUrl, { headers: { Authorization: `Bearer ${authToken}` } })
      .subscribe(
        (data: any) => {
          if (data && data.status === 200 && data.UserLikeFood && Array.isArray(data.UserLikeFood)) {
            data.UserLikeFood.forEach((item: any) => {
              this.fetchFoodDetails(item.food_id);
            });
          } else {
            console.error('Invalid liked foods response:', data);
          }
        },
        (error) => {
          console.error('Error fetching liked foods:', error);
        }
      );
  }

  fetchFoodDetails(foodId: number): void {
    const apiUrl = `http://127.0.0.1:8000/api/food/${foodId}`;
    this.http.get(apiUrl)
      .subscribe(
        (response: any) => {
          if (response && response.status === 200 && response.food && response.food.length > 0) {
            const food = response.food[0];
            this.likedFoods.push({ ...food, isLiked: true });
          } else {
            console.error('Invalid food details response:', response);
          }
        },
        (error) => {
          console.error('Error fetching food details:', error);
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
      const apiUrl = `http://127.0.0.1:8000/api/user_like_food/${food.food_id}`;
      this.http.delete(apiUrl, { headers: { Authorization: `Bearer ${authToken}` } })
        .subscribe(
          () => {
            food.isLiked = false;
            this.likedFoods = this.likedFoods.filter((item) => item.food_id !== food.food_id);
          },
          (error) => {
            console.error('Error unliking food:', error);
          }
        );
    } else {
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
}