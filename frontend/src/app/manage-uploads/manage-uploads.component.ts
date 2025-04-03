import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoodService } from '../services/food.service';
import { ExerciseService } from '../services/exercise.service';
import { DietService } from '../services/diet.service';
import { WorkoutService } from '../services/workout.service';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-manage-uploads',
    imports: [CommonModule],
    templateUrl: './manage-uploads.component.html',
    styleUrl: './manage-uploads.component.css'
})
export class ManageUploadsComponent implements OnInit {
    foods: any[] = [];
    ingredients: any[] = [];
    exercises: any[] = [];
    workouts: any[] = [];
    diets: any[] = [];
    selectedFoodIngredients: any[] = [];

    allUploads: any[] = [];

    uploadedFoods: any[] = [];
    uploadedExercises: any[] = [];
    uploadedWorkouts: any[] = [];
    uploadedDiets: any[] = [];

    selectedFood: any = null;
    selectedExercise: any = null;
    selectedWorkout: any = null;
    selectedDiet: any = null;

    showFoodPopup: boolean = false;
    showExercisePopup: boolean = false;
    showWorkoutPopup: boolean = false;
    showDietPopup: boolean = false;

    loading: boolean = false;

    meals: any[] = [];
    likedFoods: any[] = [];
    likedExercises: any[] = [];

    userId: string = '';

    constructor(private authService: AuthService, private foodService: FoodService, private exerciseService: ExerciseService, private dietService: DietService, private workoutService: WorkoutService, private apiService: ApiService) { }

    ngOnInit(): void {
        this.loading = true;
        const userData = this.authService.getUserData();
        if (userData) {
            this.userId = userData.id || '';
        }
        this.fetchIngredients();
        this.fetchFoods();
        this.fetchExercises();
        this.fetchDiets();
        this.fetchWorkouts();
        this.fetchMeals();
        this.fetchLikedFoods();
        this.fetchLikedExercises();
    }

    fetchMeals(): void {
        this.foodService.getMeals().subscribe({
            next: (res: any) => {
                this.meals = res.Meals;
            },
            error: (error) => {
                console.error('Error fetching meals:', error);
            }
        });
    }

    fetchLikedFoods(): void {
        this.foodService.getLikedFoods().subscribe({
            next: (res: any) => {
                this.likedFoods = res.UserLikeFood;
            },
            error: (error) => {
                console.error('Error fetching liked foods:', error);
            }
        });
    }

    fetchLikedExercises(): void {
        this.exerciseService.getLikedExercises().subscribe({
            next: (res: any) => {
                this.likedExercises = res.userLikeExercise;
            },
            error: (error) => {
                console.error('Error fetching liked exercises:', error);
            },
        });
    }

    fetchFoods(): void {
        this.foodService.getFoods().subscribe({
            next: (data) => {
                this.uploadedFoods = data.food.filter((food: any) => food.user_id == this.userId);
                this.allUploads = [...this.allUploads, ...this.uploadedFoods];
                this.foods = data.food;
                this.checkLoadingComplete();
            },
            error: (error) => {
                console.error('Error fetching food:', error);
                this.checkLoadingComplete();
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

    openFoodPopup(food: any): void {
        this.selectedFood = food;
        console.log('Selected food:', this.selectedFood);
    
        this.selectedFoodIngredients = this.ingredients.filter(
            (ingredient: any) => ingredient.food_id === this.selectedFood.food_id
        );
        console.log('Selected food ingredients:', this.selectedFoodIngredients);

        this.showFoodPopup = true;
    }

    closeFoodPopup(): void {
        this.showFoodPopup = false;
        this.selectedFood = null;
    }

    fetchExercises(): void {
        this.exerciseService.getExercises().subscribe({
            next: (data) => {
                this.uploadedExercises = data.exercise.filter((exercise: any) => exercise.user_id == this.userId);
                this.allUploads = [...this.allUploads, ...this.uploadedExercises];
                this.exercises = data.exercise;
                this.checkLoadingComplete();
            },
            error: (error) => {
                console.error('Error fetching exercises:', error);
                this.checkLoadingComplete();
            }
        });
    }

    openExercisePopup(exercise: any): void {
        this.selectedExercise = exercise;
        this.showExercisePopup = true;
    }

    closeExercisePopup(): void {
        this.showExercisePopup = false;
        this.selectedExercise = null;
    }

    fetchWorkouts(): void {
        this.workoutService.getWorkouts().subscribe({
            next: (data) => {
                this.uploadedWorkouts = data.workout_plan.filter((workout: any) => workout.user_id == this.userId);
                this.allUploads = [...this.allUploads, ...this.uploadedWorkouts];
                this.workouts = data.workout_plan;
                this.checkLoadingComplete();
            },
            error: (error) => {
                console.error('Error fetching workouts:', error);
                this.checkLoadingComplete();
            }
        });
    }

    openWorkoutPopup(workout: any): void {
        this.selectedWorkout = {
            ...workout,
            exercises: this.getWorkoutExercises(workout),
        };
        this.showWorkoutPopup = true;
    }

    closeWorkoutPopup(): void {
        this.showWorkoutPopup = false;
        this.selectedWorkout = null;
    }

    toggleExerciseDetails(exercise: any): void {
        exercise.isExpanded = !exercise.isExpanded;
    }

    getWorkoutExercises(workout: any): any[] {
        return [workout.exercise1_id, workout.exercise2_id, workout.exercise3_id, workout.exercise4_id, workout.exercise5_id,]
            .filter((id) => id)
            .map((id) => {
                const exercise = this.exercises.find((ex) => ex.exercise_id === id);
                if (exercise) {
                    exercise.isExpanded = false;
                }
                return exercise;
            })
            .filter((ex) => ex);
    }

    fetchDiets(): void {
        this.dietService.getDiets().subscribe({
            next: (data) => {
                this.uploadedDiets = data.workout_plan.filter((diet: any) => diet.user_id == this.userId);
                this.allUploads = [...this.allUploads, ...this.uploadedDiets];
                this.diets = data.workout_plan;
                this.checkLoadingComplete();
            },
            error: (error) => {
                console.error('Error fetching diets:', error);
                this.checkLoadingComplete();
            }
        });
    }

    openDietPopup(diet: any): void {
        this.selectedDiet = diet;
        this.fetchDietFoods([diet.food1_id, diet.food2_id, diet.food3_id]);
    }

    closeDietPopup(): void {
        this.showDietPopup = false;
        this.selectedDiet = null;
        this.foods = [];
    }

    fetchDietFoods(foodIds: number[]): void {
        this.foodService.getFoods().subscribe({
            next: (data) => {
                this.foods = data.food.filter((food: any) => foodIds.includes(food.food_id));
                this.showDietPopup = true;
            },
            error: (error) => console.error('Error fetching foods:', error),
        });
    }

    checkLoadingComplete(): void {
        if (
            this.foods.length > 0 &&
            this.exercises.length > 0 &&
            this.workouts.length > 0 &&
            this.diets.length > 0
        ) {
            this.loading = false;
        }
    }

    deleteFood(foodId: number): void {
        const foodToDelete = this.uploadedFoods.find(food => food.food_id === foodId);
        const mealToDelete = this.meals.find(meal => meal.food_id === foodId);
        const likedFoodToDelete = this.likedFoods.find(likedFood => likedFood.food_id === foodId);

        this.uploadedFoods = this.uploadedFoods.filter(food => food.food_id !== foodId);
        this.allUploads = this.allUploads.filter(item => item.food_id !== foodId);
        this.meals = this.meals.filter(meal => meal.food_id !== foodId);
        this.likedFoods = this.likedFoods.filter(likedFood => likedFood.food_id !== foodId);

        this.apiService.delete(`food/${foodId}`).subscribe({
            error: (error) => {
                console.error('Error deleting food:', error);
                if (foodToDelete) {
                    this.uploadedFoods = [...this.uploadedFoods, foodToDelete];
                    this.allUploads = [...this.allUploads, foodToDelete];
                }
            }
        });

        this.apiService.delete(`food_ingredients/${foodId}`).subscribe({
            error: (error) => console.error('Error deleting food ingredients:', error)
        });

        if (mealToDelete) {
            this.apiService.delete(`meals/${foodId}`).subscribe({
                error: (error) => {
                    console.error('Error deleting meal:', error);
                    if (mealToDelete) {
                        this.meals = [...this.meals, mealToDelete];
                    }
                }
            });
        }

        if (likedFoodToDelete) {
            this.apiService.delete(`user_like_food/${foodId}`).subscribe({
                error: (error) => {
                    console.error('Error deleting liked food:', error);
                    if (likedFoodToDelete) {
                        this.likedFoods = [...this.likedFoods, likedFoodToDelete];
                    }
                }
            });
        }
    }

    deleteExercise(exerciseId: number): void {
        const exerciseToDelete = this.uploadedExercises.find(ex => ex.exercise_id === exerciseId);
        const likedExerciseToDelete = this.likedExercises.find(ex => ex.exercise_id === exerciseId);

        this.uploadedExercises = this.uploadedExercises.filter(ex => ex.exercise_id !== exerciseId);
        this.allUploads = this.allUploads.filter(item => item.exercise_id !== exerciseId);
        this.likedExercises = this.likedExercises.filter(ex => ex.exercise_id !== exerciseId);

        this.apiService.delete(`exercise/${exerciseId}`).subscribe({
            error: (error) => {
                console.error('Error deleting exercise:', error);
                if (exerciseToDelete) {
                    this.uploadedExercises = [...this.uploadedExercises, exerciseToDelete];
                    this.allUploads = [...this.allUploads, exerciseToDelete];
                }
            }
        });

        if (likedExerciseToDelete) {
            this.apiService.delete(`user_like_exercise/${exerciseId}`).subscribe({
                error: (error) => {
                    console.error('Error deleting liked exercise:', error);
                    if (likedExerciseToDelete) {
                        this.likedExercises = [...this.likedExercises, likedExerciseToDelete];
                    }
                }
            });
        }
    }

    deleteWorkout(workoutId: number): void {
        const workoutToDelete = this.uploadedWorkouts.find(w => w.id === workoutId);

        this.uploadedWorkouts = this.uploadedWorkouts.filter(w => w.id !== workoutId);
        this.allUploads = this.allUploads.filter(item => item.id !== workoutId);

        this.apiService.delete(`workout_plan/${workoutId}`).subscribe({
            error: (error) => {
                console.error('Error deleting workout:', error);
                if (workoutToDelete) {
                    this.uploadedWorkouts = [...this.uploadedWorkouts, workoutToDelete];
                    this.allUploads = [...this.allUploads, workoutToDelete];
                }
            }
        });
    }

    deleteDiet(dietId: number): void {
        const dietToDelete = this.uploadedDiets.find(d => d.id === dietId);

        this.uploadedDiets = this.uploadedDiets.filter(d => d.id !== dietId);
        this.allUploads = this.allUploads.filter(item => item.id !== dietId);

        this.apiService.delete(`diet_plan/${dietId}`).subscribe({
            error: (error) => {
                console.error('Error deleting diet:', error);
                if (dietToDelete) {
                    this.uploadedDiets = [...this.uploadedDiets, dietToDelete];
                    this.allUploads = [...this.allUploads, dietToDelete];
                }
            }
        });
    }
}
