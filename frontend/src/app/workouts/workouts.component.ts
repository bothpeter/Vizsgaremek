import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortWorkoutsPipe } from '../pipes/sort-workouts.pipe';

@Component({
  selector: 'app-workouts',
  standalone: true,
  imports: [CommonModule, SortWorkoutsPipe],
  templateUrl: './workouts.component.html',
  styleUrls: ['./workouts.component.css']
})
export class WorkoutsComponent implements OnInit {
  workouts: any[] = [];
  exercises: any[] = [];
  selectedWorkout: any = null;
  showPopup: boolean = false;
  selectedType: string = 'all';

  constructor() { }

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
}