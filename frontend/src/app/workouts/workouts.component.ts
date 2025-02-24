import { Component, OnInit } from '@angular/core';
import { WorkoutService } from '../services/workout.service';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SortWorkoutsPipe } from '../pipes/sort-workouts.pipe';

@Component({
    selector: 'app-workouts',
    standalone: true,
    imports: [CommonModule, FormsModule, SortWorkoutsPipe],
    templateUrl: './workouts.component.html',
    styleUrls: ['./workouts.component.css'],
})

export class WorkoutsComponent implements OnInit {
    workouts: any[] = [];
    exercises: any[] = [];
    selectedType: string = 'all';
    selectedWorkout: any = null;
    showPopup: boolean = false;

    showAddWorkoutPopup: boolean = false;
    newWorkout: any = {
        title: '',
        goodFor: '',
        description: '',
        type: 'Edzőtermi edzés',
        exercises: [{ exercise_id: null }],
    };

    constructor(private workoutService: WorkoutService, private authService: AuthService) { }

    ngOnInit(): void {
        this.fetchExercises();
        this.fetchWorkouts();
    }

    fetchExercises(): void {
        this.workoutService.getExercises().subscribe({
            next: (data) => (this.exercises = data.exercise),
            error: (error) => console.error('Error fetching exercises:', error),
        });
    }

    fetchWorkouts(): void {
        this.workoutService.getWorkouts().subscribe({
            next: (data) => (this.workouts = data.workout_plan),
            error: (error) => console.error('Error fetching workouts:', error),
        });
    }

    getWorkoutExercises(workout: any): any[] {
        return [workout.exercise1_id, workout.exercise2_id, workout.exercise3_id, workout.exercise4_id, workout.exercise5_id,]
            .filter((id) => id)
            .map((id) => {
                const exercise = this.exercises.find((ex) => ex.exercise_id === id);
                if (exercise) {
                    exercise.isExpanded = false; // Initialize isExpanded property
                }
                return exercise;
            })
            .filter((ex) => ex);
    }

    addWorkout(): void {
        if (!this.authService.isAuthenticated()) {
            alert('Kérjük, jelentkezzen be az edzésterv hozzáadásához!');
            return;
        }

        const payload = {
            ...this.newWorkout,
            exercise1_id: this.newWorkout.exercises[0]?.exercise_id || null,
            exercise2_id: this.newWorkout.exercises[1]?.exercise_id || null,
            exercise3_id: this.newWorkout.exercises[2]?.exercise_id || null,
            exercise4_id: this.newWorkout.exercises[3]?.exercise_id || null,
            exercise5_id: this.newWorkout.exercises[4]?.exercise_id || null,
        };

        this.workoutService.addWorkout(payload).subscribe({
            next: () => {
                this.fetchWorkouts();
                this.closeAddWorkoutPopup();
            },
            error: (error) => console.error('Error adding workout:', error),
        });
    }

    openAddWorkoutPopup(): void {
        this.showAddWorkoutPopup = true;
    }

    closeAddWorkoutPopup(): void {
        this.showAddWorkoutPopup = false;
        this.resetNewWorkoutForm();
    }

    resetNewWorkoutForm(): void {
        this.newWorkout = {
            title: '',
            goodFor: '',
            description: '',
            type: 'Edzőtermi edzés',
            exercises: [{ exercise_id: null }],
        };
    }

    openPopup(workout: any): void {
        this.selectedWorkout = {
            ...workout,
            exercises: this.getWorkoutExercises(workout),
        };
        this.showPopup = true;
    }

    closePopup(): void {
        this.showPopup = false;
        this.selectedWorkout = null;
    }

    changeType(type: string): void {
        this.selectedType = type;
    }

    toggleExerciseDetails(exercise: any): void {
        exercise.isExpanded = !exercise.isExpanded;
    }

    addExercise(): void {
        if (this.newWorkout.exercises.length < 5) {
            this.newWorkout.exercises.push({ exercise_id: null });
        }
    }

    removeExercise(index: number): void {
        if (this.newWorkout.exercises.length > 1) {
            this.newWorkout.exercises.splice(index, 1);
        }
    }
}