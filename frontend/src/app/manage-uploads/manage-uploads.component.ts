import { Component, OnInit } from '@angular/core';
import { VerticalNavUserComponent } from '../components/vertical-nav-user/vertical-nav-user.component';
import { CommonModule } from '@angular/common';
import { FoodService } from '../services/food.service';
import { AuthService } from '../services/auth.service';
import { ExerciseService } from '../services/exercise.service';
import { DietService } from '../services/diet.service';
import { WorkoutService } from '../services/workout.service';

@Component({
    selector: 'app-manage-uploads',
    imports: [VerticalNavUserComponent, CommonModule],
    templateUrl: './manage-uploads.component.html',
    styleUrl: './manage-uploads.component.css'
})
export class ManageUploadsComponent implements OnInit {
    allFoods: any[] = [];
    allExercises: any[] = [];
    allDiets: any[] = [];
    allWorkouts: any[] = [];

    allUploadsByUser: any[] = [];
    foodsUploadedByUser: any[] = [];
    exercisesUploadedByUser: any[] = [];
    dietsUploadedByUser: any[] = [];
    workoutsUploadedByUser: any[] = [];

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
                this.foodsUploadedByUser = data.food.filter((food: any) => food.user_id == userId);
                this.allUploadsByUser = [...this.allUploadsByUser, ...this.foodsUploadedByUser];
                this.allFoods = data.food;
                console.log('Foods By User:', this.foodsUploadedByUser);
                console.log('All uploads:', this.allUploadsByUser);
                console.log('All foods:', this.allFoods);
            },
            error: (error) => console.error('Error fetching food:', error),
        });
    }

    fetchExercises(): void {
        const userId = localStorage.getItem('userId');
        this.exerciseService.getExercises().subscribe({
            next: (data) => {
                this.exercisesUploadedByUser = data.exercise.filter((exercise: any) => exercise.user_id == userId);
                this.allUploadsByUser = [...this.allUploadsByUser, ...this.exercisesUploadedByUser];
                this.allExercises = data.exercise;
                console.log('Exercises By User:', this.exercisesUploadedByUser);
                console.log('All uploads:', this.allUploadsByUser);
                console.log('All exercises:', this.allExercises);
            },
            error: (error) => console.error('Error fetching exercises:', error),
        });
    }

    fetchDiets(): void {
        const userId = localStorage.getItem('userId');
        this.dietService.getDiets().subscribe({
            next: (data) => {
                this.dietsUploadedByUser = data.workout_plan.filter((diet: any) => diet.user_id == userId);
                this.allUploadsByUser = [...this.allUploadsByUser, ...this.dietsUploadedByUser];
                this.allDiets = data.workout_plan;
                console.log('Diets By User:', this.dietsUploadedByUser);
                console.log('All uploads:', this.allUploadsByUser);
                console.log('All diets:', this.allDiets);
            },
            error: (error) => console.error('Error fetching diets:', error),
        });
    }

    fetchWorkouts(): void {
        const userId = localStorage.getItem('userId');
        this.workoutService.getWorkouts().subscribe({
            next: (data) => {
                this.workoutsUploadedByUser = data.workout_plan.filter((workout: any) => workout.user_id == userId);
                this.allUploadsByUser = [...this.allUploadsByUser, ...this.workoutsUploadedByUser];
                this.allWorkouts = data.workout_plan;
                console.log('Workouts By User:', this.workoutsUploadedByUser);
                console.log('All uploads:', this.allUploadsByUser);
                console.log('All workouts:', this.allWorkouts);
            },
            error: (error) => console.error('Error fetching workouts:', error),
        });
    }
}
