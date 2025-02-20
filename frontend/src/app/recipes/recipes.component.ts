import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { sortFoodsPipe } from '../pipes/sort-foods.pipe';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [CommonModule, sortFoodsPipe, FormsModule],
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
})
export class RecipesComponent implements OnInit {
  food: any[] = [];
  selectedFood: any = null;
  ingredients: any[] = [];
  showPopup: boolean = false;
  selectedType: string = 'all';
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

  openAddFoodPopup(): void {
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

  addFood(): void {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      alert('Please log in to add food.');
      return;
    }

    // Determine the new food_id
    const newFoodId = Math.max(...this.food.map((f) => f.food_id)) + 1;

    // Prepare FormData for the food and image
    const formData = new FormData();
    formData.append('name', this.newFood.name);
    formData.append('description', this.newFood.description);
    formData.append('type', this.newFood.type);
    formData.append('calorie', this.newFood.calorie.toString());
    formData.append('fat', this.newFood.fat.toString());
    formData.append('protein', this.newFood.protein.toString());
    formData.append('carb', this.newFood.carb.toString());
    if (this.newFood.imgFile) {
      formData.append('img', this.newFood.imgFile);
    }
    formData.append('recipe', this.newFood.recipe);

    this.http.post('http://127.0.0.1:8000/api/food', formData, { headers: { Authorization: `Bearer ${authToken}` } })
      .subscribe(
        () => {
          this.food.push({ ...this.newFood, food_id: newFoodId });

          this.newFood.ingredients.forEach((ingredient: any) => {
            const ingredientPayload = {
              food_id: newFoodId,
              ingredient_name: ingredient.ingredient_name,
              amount: ingredient.amount,
            };

            this.http.post('http://127.0.0.1:8000/api/food_ingredients', ingredientPayload, { headers: { Authorization: `Bearer ${authToken}` } })
              .subscribe(
                () => console.log('Ingredient added successfully'),
                (error) => console.error('Error adding ingredient:', error)
              );
          });

          this.closeAddFoodPopup();
        },
        (error) => {
          console.error('Error adding food:', error);
        }
      );
  }
}