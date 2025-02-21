import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortWorkoutsPipe } from '../pipes/sort-workouts.pipe';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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
    exercise1_id: null,
    exercise2_id: null,
    exercise3_id: null,
    exercise4_id: null,
    exercise5_id: null,
  };
  selectedExercises: number[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchExercises().then(() => this.fetchWorkouts());
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

  fetchWorkouts(): void {
    fetch('http://127.0.0.1:8000/api/workout_plan')
      .then(response => response.json())
      .then(data => {
        this.workouts = data.workout_plan;
      })
      .catch(error => console.error('Error fetching workout plans:', error));
  }

  fetchExercises(): Promise<void> {
    return fetch('http://127.0.0.1:8000/api/exercise')
      .then(response => response.json())
      .then(data => {
        this.exercises = data.exercise;
      })
      .catch(error => console.error('Error fetching exercises:', error));
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
      exercise1_id: null,
      exercise2_id: null,
      exercise3_id: null,
      exercise4_id: null,
      exercise5_id: null,
    };
    this.selectedExercises = [];
  }

  onExerciseSelect(event: any, exerciseId: number): void {
    if (event.target.checked) {
      this.selectedExercises.push(exerciseId);
    } else {
      this.selectedExercises = this.selectedExercises.filter(id => id !== exerciseId);
    }
  }

  addWorkout(): void {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      alert('Kérjük, jelentkezz be az új edzésprogram hozzáadásához!');
      return;
    }

    // Assign selected exercises to the new workout
    this.newWorkout.exercise1_id = this.selectedExercises[0] || null;
    this.newWorkout.exercise2_id = this.selectedExercises[1] || null;
    this.newWorkout.exercise3_id = this.selectedExercises[2] || null;
    this.newWorkout.exercise4_id = this.selectedExercises[3] || null;
    this.newWorkout.exercise5_id = this.selectedExercises[4] || null;

    this.http.post('http://127.0.0.1:8000/api/workout_plan', this.newWorkout, {
      headers: { Authorization: `Bearer ${authToken}` }
    })
      .subscribe(
        () => {
          this.fetchWorkouts();
          this.closeAddWorkoutPopup();
        },
        (error) => {
          console.error('Error adding workout:', error);
        }
      );
  }
}