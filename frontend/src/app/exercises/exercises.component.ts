import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchExercises();
    this.fetchLikedExercises();
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

  fetchLikedExercises(): void {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) return;

    const apiUrl = 'http://127.0.0.1:8000/api/user_like_exercise';
    this.http.get(apiUrl, { headers: { Authorization: `Bearer ${authToken}` } })
      .subscribe(
        (data: any) => {
          if (data && data.userLikeExercise && Array.isArray(data.userLikeExercise)) {
            const likedExerciseIds = data.userLikeExercise.map((item: any) => item.exercise_id);
            this.exercises.forEach((exercise) => {
              exercise.isLiked = likedExerciseIds.includes(exercise.exercise_id);
            });
          } else {
            console.error('Invalid response format:', data);
          }
        },
        (error) => {
          console.error('Error fetching liked exercises:', error);
        }
      );
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

  toggleLike(exercise: any): void {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      alert('Please log in to like this exercise!');
      return;
    }

    if (exercise.isLiked) {
      const apiUrl = `http://127.0.0.1:8000/api/user_like_exercise/${exercise.exercise_id}`;
      this.http.delete(apiUrl, { headers: { Authorization: `Bearer ${authToken}` } })
        .subscribe(
          () => {
            exercise.isLiked = false;
          },
          (error) => {
            console.error('Error unliking exercise:', error);
          }
        );
    } else {
      const apiUrl = 'http://127.0.0.1:8000/api/user_like_exercise';
      const payload = { exercise_id: exercise.exercise_id };
      this.http.post(apiUrl, payload, { headers: { Authorization: `Bearer ${authToken}` } })
        .subscribe(
          () => {
            exercise.isLiked = true;
          },
          (error) => {
            console.error('Error liking exercise:', error);
          }
        );
    }
  }
}
