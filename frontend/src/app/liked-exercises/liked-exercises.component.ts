import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ExerciseService } from '../services/exercise.service';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-liked-exercises',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './liked-exercises.component.html',
    styleUrls: ['./liked-exercises.component.css'],
})
export class LikedExercisesComponent implements OnInit {
    likedExercises: any[] = [];
    uploaderData: any = null;
    selectedExercise: any = null;
    showPopup: boolean = false;
    errorMessage: string = '';
    loading: boolean = false;

    constructor(private exerciseService: ExerciseService) { }

    ngOnInit(): void {
        this.fetchLikedExercises();
    }

    fetchUploaderData(): void {
        this.exerciseService.getUploaderData().subscribe({
            next: (data) => {
                const filteredUsers = data.users.filter((user: any) => user.id === this.selectedExercise.user_id);
                this.uploaderData = filteredUsers.length > 0 ? filteredUsers[0] : null;
                this.showPopup = true;
            },
            error: (error) => console.error('Error fetching uploader data:', error),
        });
    }

    fetchLikedExercises(): void {
        this.loading = true;
        this.exerciseService.getLikedExercises().subscribe({
            next: (res: any) => this.handleLikedExercisesResponse(res),
            error: (error) => this.handleLikedExercisesError(error)
        });
    }

    handleLikedExercisesResponse(res: any): void {
        if (res.status === 200 && Array.isArray(res.userLikeExercise)) {
            if (res.userLikeExercise.length === 0) {
                this.loading = false;
                return;
            }

            const exerciseDetailsObservables = res.userLikeExercise.map((item: any) =>
                this.exerciseService.getExercise(item.exercise_id)
            );

            forkJoin<any[]>(exerciseDetailsObservables).subscribe({
                next: (responses: any[]) => this.handleExerciseDetailsResponses(responses),
                error: (error) => this.handleExerciseDetailsError(error)
            });
        } else {
            console.error('Invalid liked exercises response:', res);
            this.loading = false;
        }
    }

    handleExerciseDetailsResponses(responses: any[]): void {
        responses.forEach((response: any) => {
            if (response.status === 200 && response.exercise && response.exercise.length > 0) {
                const exercise = response.exercise[0];
                this.likedExercises.push({ ...exercise, isLiked: true });
            } else {
                console.error('Invalid exercise details response:', response);
            }
        });
        this.loading = false;
    }

    handleLikedExercisesError(error: any): void {
        console.error('Error fetching liked exercises:', error);
        this.loading = false;
    }

    handleExerciseDetailsError(error: any): void {
        console.error('Error fetching exercise details:', error);
        this.loading = false;
    }

    toggleLike(exercise: any): void {
        this.exerciseService.toggleLike(exercise.exercise_id, exercise.isLiked).subscribe({
            next: () => {
                exercise.isLiked = !exercise.isLiked;
                if (!exercise.isLiked) {
                    this.likedExercises = this.likedExercises.filter(
                        (item) => item.exercise_id !== exercise.exercise_id
                    );
                }
            },
            error: (error) => {
                console.error('Error toggling like:', error);
            },
        });
    }

    openPopup(exercise: any): void {
        this.selectedExercise = exercise;
        this.fetchUploaderData();
    }

    closePopup(): void {
        this.showPopup = false;
        this.selectedExercise = null;
    }
}