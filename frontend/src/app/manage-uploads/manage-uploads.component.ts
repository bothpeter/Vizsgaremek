import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoodService } from '../services/food.service';
import { AuthService } from '../services/auth.service';
import { ExerciseService } from '../services/exercise.service';
import { DietService } from '../services/diet.service';
import { WorkoutService } from '../services/workout.service';

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
    showFoodPopup: boolean = false;
    showExercisePopup: boolean = false;

    constructor(private foodService: FoodService, private exerciseService: ExerciseService, private dietService: DietService, private workoutService: WorkoutService, private authService: AuthService) { }

    ngOnInit(): void {
        this.fetchFoods();
        this.fetchExercises();
        this.fetchDiets();
        this.fetchWorkouts();
    }

    fetchFoods(): void {
        const userId = localStorage.getItem('userId');
        this.foodService.getFoods().subscribe({
            next: (data) => {
                this.uploadedFoods = data.food.filter((food: any) => food.user_id == userId);
                this.allUploads = [...this.allUploads, ...this.uploadedFoods];
                this.foods = data.food;
            },
            error: (error) => console.error('Error fetching food:', error),
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
            },
            error: (error) => console.error('Error fetching exercises:', error),
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
            },
            error: (error) => console.error('Error fetching workouts:', error),
        });
    }

    fetchDiets(): void {
        const userId = localStorage.getItem('userId');
        this.dietService.getDiets().subscribe({
            next: (data) => {
                this.uploadedDiets = data.workout_plan.filter((diet: any) => diet.user_id == userId);
                this.allUploads = [...this.allUploads, ...this.uploadedDiets];
                this.diets = data.workout_plan;
            },
            error: (error) => console.error('Error fetching diets:', error),
        });
    }
}
