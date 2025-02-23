import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SortWorkoutsPipe } from '../pipes/sort-workouts.pipe';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
    selector: 'app-workouts',
    standalone: true,
    imports: [CommonModule, SortWorkoutsPipe, FormsModule],
    templateUrl: './workouts.component.html',
    styleUrls: ['./workouts.component.css']
})
export class WorkoutsComponent implements OnInit {
    workouts: any[] = [];
    exercises: any[] = [];
    selectedWorkout: any = null;
    showPopup: boolean = false;
    selectedType: string = 'all';
    showAddWorkoutPopup: boolean = false;
    newWorkout: any = {
        title: '',
        goodFor: '',
        description: '',
        type: 'Edzőtermi edzés',
        exercises: [{ exercise_id: null }],
    };

    constructor(private http: HttpClient) { }

    ngOnInit(): void {
        this.fetchExercises().then(() => this.fetchWorkouts());
    }

    fetchExercises(): Promise<void> {
        return fetch('http://127.0.0.1:8000/api/exercise')
            .then(response => response.json())
            .then(data => {
                this.exercises = data.exercise;
            })
            .catch(error => console.error('Error fetching exercises:', error));
    }

    fetchWorkouts(): void {
        fetch('http://127.0.0.1:8000/api/workout_plan')
            .then(response => response.json())
            .then(data => {
                this.workouts = data.workout_plan;
            })
            .catch(error => console.error('Error fetching workout plans:', error));
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

    addWorkout(): void {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            alert('Kérjük, jelentkezz be az új edzésprogram hozzáadásához!');
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

        this.http.post('http://127.0.0.1:8000/api/workout_plan', payload, {
            headers: { Authorization: `Bearer ${authToken}` }
        })
            .subscribe(
                (response) => {
                    this.fetchWorkouts();
                    this.closeAddWorkoutPopup();
                },
                (error) => {
                    console.error('Error adding workout:', error);
                }
            );
    }

    openPopup(workout: any): void {
        this.selectedWorkout = {
            ...workout,
            exercises: this.getWorkoutExercises(workout)
        };
        this.showPopup = true;
    }

    closePopup(): void {
        this.showPopup = false;
        this.selectedWorkout = null;
    }

    getWorkoutExercises(workout: any): any[] {
        return [workout.exercise1_id, workout.exercise2_id, workout.exercise3_id, workout.exercise4_id, workout.exercise5_id]
            .filter(id => id)
            .map(id => {
                const exercise = this.exercises.find(ex => ex.exercise_id === id);
                if (exercise) {
                    exercise.isExpanded = false;
                }
                return exercise;
            })
            .filter(ex => ex);
    }

    toggleExerciseDetails(exercise: any): void {
        exercise.isExpanded = !exercise.isExpanded;
    }

    changeType(type: string): void {
        this.selectedType = type;
    }
}