import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VerticalNavUserComponent } from '../components/vertical-nav-user/vertical-nav-user.component';
import { ExerciseService } from '../services/exercise.service';

@Component({
    selector: 'app-liked-exercises',
    standalone: true,
    imports: [CommonModule, RouterModule, VerticalNavUserComponent],
    templateUrl: './liked-exercises.component.html',
    styleUrls: ['./liked-exercises.component.css'],
})

export class LikedExercisesComponent implements OnInit {
    likedExercises: any[] = [];
    selectedExercise: any = null;
    showPopup: boolean = false;
    errorMessage: string = '';

    constructor(private exerciseService: ExerciseService) { }

    ngOnInit(): void {
        this.fetchLikedExercises();
    }

    fetchLikedExercises(): void {
        this.exerciseService.getLikedExercises().subscribe({
            next: (res: any) => {
                if (res.status === 200 && Array.isArray(res.userLikeExercise)) {
                    this.likedExercises = [];
                    const exerciseIds = res.userLikeExercise.map((item: any) => item.exercise_id);
                    exerciseIds.forEach((id: number) => this.fetchExerciseDetails(id));
                } else {
                    console.error('Invalid liked exercises response:', res);
                }
            },
            error: (error) => {
                console.error('Error fetching liked exercises:', error);
            }
        });
    }

    fetchExerciseDetails(exerciseId: number): void {
        this.exerciseService.getExercise(exerciseId).subscribe({
            next: (response: any) => {
                if (response.status === 200 && response.exercise && response.exercise.length > 0) {
                    const exercise = response.exercise[0];
                    this.likedExercises.push({ ...exercise, isLiked: true });
                } else {
                    console.error('Invalid exercise details response:', response);
                }
            },
            error: (error) => {
                console.error('Error fetching exercise details:', error);
            }
        });
    }

    toggleLike(exercise: any): void {
        this.exerciseService.toggleLike(exercise.exercise_id, exercise.isLiked).subscribe({
            next: () => {
                exercise.isLiked = !exercise.isLiked;
                if (!exercise.isLiked) {
                    this.likedExercises = this.likedExercises.filter((item) => item.exercise_id !== exercise.exercise_id);
                }
            },
            error: (error) => {
                console.error('Error toggling like:', error);
            }
        });
    }

    openPopup(exercise: any): void {
        this.selectedExercise = exercise;
        this.showPopup = true;
    }

    closePopup(): void {
        this.showPopup = false;
        this.selectedExercise = null;
    }
}