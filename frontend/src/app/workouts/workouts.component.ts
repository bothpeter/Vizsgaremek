import { Component, OnInit } from '@angular/core';
import { WorkoutService } from '../services/workout.service';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginPopupComponent } from '../components/login-popup/login-popup.component';

@Component({
    selector: 'app-workouts',
    standalone: true,
    imports: [CommonModule, FormsModule, LoginPopupComponent],
    templateUrl: './workouts.component.html',
    styleUrls: ['./workouts.component.css'],
})

export class WorkoutsComponent implements OnInit {
    workouts: any[] = [];
    exercises: any[] = [];
    uploaderData: any = null;
    selectedType: string = 'all';
    selectedWorkout: any = null;
    showPopup: boolean = false;
    showLoginPopup: boolean = false;
    searchQuery = '';
    loading: boolean = false;

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
        this.addEscapeListener();
    }

    ngOnDestroy(): void {
        this.removeEscapeListener();
    }

    addEscapeListener(): void {
        document.addEventListener('keydown', this.handleEscapeKey.bind(this));
    }

    removeEscapeListener(): void {
        document.removeEventListener('keydown', this.handleEscapeKey.bind(this));
    }

    handleEscapeKey(event: KeyboardEvent): void {
        if (event.key === 'Escape') {
            if (this.showPopup) {
                this.closePopup();
            } else if (this.showLoginPopup) {
                this.closeLoginPopup();
            } else if (this.showAddWorkoutPopup) {
                this.closeAddWorkoutPopup();
            }
        }
    }

    fetchUploaderData(): void {
        this.workoutService.getUploaderData().subscribe({
            next: (data) => {
                const filteredUsers = data.users.filter((user: any) => user.id === this.selectedWorkout.user_id);
                this.uploaderData = filteredUsers.length > 0 ? filteredUsers[0] : null;
                this.showPopup = true;
            },
            error: (error) => console.error('Error fetching uploader data:', error),
        });
    }

    fetchExercises(): void {
        this.workoutService.getExercises().subscribe({
            next: (data) => {
                this.exercises = data.exercise;
            },
            error: (error) => {
                console.error('Error fetching exercises:', error);
                this.loading = false;
            }
        });
    }

    fetchWorkouts(): void {
        this.loading = true;
        this.workoutService.getWorkouts().subscribe({
            next: (data) => {
                this.loading = false;
                this.workouts = data.workout_plan;
            },
            error: (error) => {
                console.error('Error fetching workouts:', error);
                this.loading = false;
            }
        });
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
        if (!this.authService.isAuthenticated()) {
            this.openLoginPopup();
            return;
        }
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
        this.fetchUploaderData();
    }

    closePopup(): void {
        this.showPopup = false;
        this.selectedWorkout = null;
    }

    openLoginPopup(): void {
        this.showLoginPopup = true;
    }

    closeLoginPopup(): void {
        this.showLoginPopup = false;
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

    get filteredWorkouts() {
        return this.workouts.filter(workout => {
            const matchesSearch = workout.title.toLowerCase().includes(this.searchQuery.toLowerCase());
            const matchesType = this.selectedType === 'all' || workout.type === this.selectedType;
            return matchesSearch && matchesType;
        });
    }

    clearSearch() {
        this.searchQuery = '';
    }
}