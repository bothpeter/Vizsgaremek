import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exercises',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exercises.component.html',
  styleUrls: ['./exercises.component.css']
})
export class ExercisesComponent implements OnInit {
  exercises: any[] = [];
  selectedExercise: any = null;
  showPopup: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.fetchExercises();
  }
  
  openPopup(exercise: any): void {
    this.selectedExercise = exercise;
    this.showPopup = true;
  }

  closePopup(): void {
    this.showPopup = false;
    this.selectedExercise = null;
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
        console.log(this.exercises);
      })
      .catch((error) => {
        console.error('Error fetching exercises:', error);
      });
  }

}
