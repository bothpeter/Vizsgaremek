import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortExercisesPipe } from '../pipes/sort-exercises.pipe';

@Component({
  selector: 'app-exercises',
  standalone: true,
  imports: [CommonModule, SortExercisesPipe],
  templateUrl: './exercises.component.html',
  styleUrls: ['./exercises.component.css'],
})
export class ExercisesComponent implements OnInit {
  exercises: any[] = [];
  selectedExercise: any = null;
  showPopup: boolean = false;
  selectedType: string = 'all';
  selectedMuscleGroup: string = 'all';

  constructor() {}

  ngOnInit(): void {
    this.fetchExercises();
  }

  fetchExercises(): void {
    const apiUrl = 'http://127.0.0.1:8000/api/exercise';
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        this.exercises = data.exercise;
      })
      .catch((error) => {
        console.error('Error fetching exercises:', error);
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

  changeType(type: string): void {
    this.selectedType = type;
  }

  changeMuscleGroup(muscleGroup: string): void {
    this.selectedMuscleGroup = muscleGroup;
  }
}