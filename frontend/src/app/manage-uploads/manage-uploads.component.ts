import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoodService } from '../services/food.service';
import { ExerciseService } from '../services/exercise.service';
import { DietService } from '../services/diet.service';
import { WorkoutService } from '../services/workout.service';
import { ApiService } from '../services/api.service';

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

    constructor(private foodService: FoodService, private exerciseService: ExerciseService, private dietService: DietService, private workoutService: WorkoutService, private apiService: ApiService) { }

    ngOnInit(): void {
        this.loading = true;
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
        const userId = localStorage.getItem('userId');
        this.foodService.getFoods().subscribe({
            next: (data) => {
                this.uploadedFoods = data.food.filter((food: any) => food.user_id == userId);
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

    fetchIngredients(foodId: number): void {
        this.foodService.getIngredients(foodId).subscribe({
            next: (data) => {
                this.showFoodPopup = true;
                this.ingredients = data.ingredients;
            },
            error: (error) => console.error('Error fetching ingredients:', error),
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

    fetchExercises(): void {
        const userId = localStorage.getItem('userId');
        this.exerciseService.getExercises().subscribe({
            next: (data) => {
                this.uploadedExercises = data.exercise.filter((exercise: any) => exercise.user_id == userId);
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
        const userId = localStorage.getItem('userId');
        this.workoutService.getWorkouts().subscribe({
            next: (data) => {
                this.uploadedWorkouts = data.workout_plan.filter((workout: any) => workout.user_id == userId);
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
        const userId = localStorage.getItem('userId');
        this.dietService.getDiets().subscribe({
            next: (data) => {
                this.uploadedDiets = data.workout_plan.filter((diet: any) => diet.user_id == userId);
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
        this.apiService.delete(`food/${foodId}`).subscribe({
            next: () => {
                this.apiService.delete(`food_ingredients/${foodId}`).subscribe({
                    next: () => {
                        this.uploadedFoods = this.uploadedFoods.filter(food => food.food_id !== foodId);
                        this.allUploads = this.allUploads.filter(item => item.food_id !== foodId);
                    },
                    error: (error) => console.error('Error deleting food ingredients:', error),
                });
    
                if (this.meals.some(meal => meal.food_id === foodId)) {
                    this.apiService.delete(`meals/${foodId}`).subscribe({
                        next: () => {
                            this.meals = this.meals.filter((meal) => meal.food_id !== foodId);
                        },
                        error: (error) => {
                            console.error('Error deleting meal:', error);
                        },
                    });
                }
    
                if (this.likedFoods.some(likedFood => likedFood.food_id === foodId)) {
                    this.apiService.delete(`user_like_food/${foodId}`).subscribe({
                        next: () => {
                            this.likedFoods = this.likedFoods.filter((likedFood) => likedFood.food_id !== foodId);
                        },
                        error: (error) => {
                            console.error('Error deleting liked food:', error);
                        },
                    });
                }
            },
            error: (error) => console.error('Error deleting food:', error),
        });
    }

    deleteExercise(exerciseId: number): void {
        this.apiService.delete(`exercise/${exerciseId}`).subscribe({
            next: () => {
                this.uploadedExercises = this.uploadedExercises.filter(exercise => exercise.exercise_id !== exerciseId);
                this.allUploads = this.allUploads.filter(item => item.exercise_id !== exerciseId);
    
                if (this.likedExercises.some(likedExercise => likedExercise.exercise_id === exerciseId)) {
                    this.apiService.delete(`user_like_exercise/${exerciseId}`).subscribe({
                        next: () => {
                            this.likedExercises = this.likedExercises.filter((likedExercise) => likedExercise.exercise_id !== exerciseId);
                        },
                        error: (error) => {
                            console.error('Error deleting liked exercise:', error);
                        }
                    });
                }
            },
            error: (error) => console.error('Error deleting exercise:', error),
        });
    }

    deleteWorkout(workoutId: number): void {
        this.apiService.delete(`workout_plan/${workoutId}`).subscribe({
            next: () => {
                this.uploadedWorkouts = this.uploadedWorkouts.filter(workout => workout.id !== workoutId);
                this.allUploads = this.allUploads.filter(item => item.id !== workoutId);
            },
            error: (error) => console.error('Error deleting workout:', error),
        });
    }

    deleteDiet(dietId: number): void {
        this.apiService.delete(`diet_plan/${dietId}`).subscribe({
            next: () => {
                this.uploadedDiets = this.uploadedDiets.filter(diet => diet.id !== dietId);
                this.allUploads = this.allUploads.filter(item => item.id !== dietId);
            },
            error: (error) => console.error('Error deleting diet:', error),
        });
    }
}
