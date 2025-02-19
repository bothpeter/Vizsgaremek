import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { VerticalNavUserComponent } from '../components/vertical-nav-user/vertical-nav-user.component';

@Component({
  selector: 'app-liked-exercises',
  standalone: true,
  imports: [CommonModule, RouterModule, VerticalNavUserComponent],
  templateUrl: './liked-exercises.component.html',
  styleUrls: ['./liked-exercises.component.css'],
})
export class LikedExercisesComponent implements OnInit {
  likedExercises: any[] = []; // Array to store liked exercises
  selectedExercise: any = null; // Currently selected exercise for the popup
  showPopup: boolean = false; // Controls popup visibility

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchLikedExercises();
  }

  // Fetch exercises liked by the user
  fetchLikedExercises(): void {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      alert('Please log in to view your liked exercises!');
      return;
    }
  
    const apiUrl = 'http://127.0.0.1:8000/api/user_like_exercise';
    this.http.get(apiUrl, { headers: { Authorization: `Bearer ${authToken}` } })
      .subscribe(
        (data: any) => {
          if (data && data.status === 200 && data.userLikeExercise && Array.isArray(data.userLikeExercise)) {
            this.likedExercises = []; // Clear before fetching new data
            const exerciseIds = data.userLikeExercise.map((item: any) => item.exercise_id);
            
            // Fetch all exercises in parallel
            exerciseIds.forEach((id: number) => this.fetchExerciseDetails(id));
          } else {
            console.error('Invalid liked exercises response:', data);
          }
        },
        (error) => {
          console.error('Error fetching liked exercises:', error);
        }
      );
  }
  

  // Fetch details of a specific exercise
  fetchExerciseDetails(exerciseId: number): void {
    const apiUrl = `http://127.0.0.1:8000/api/exercise/${exerciseId}`;
    this.http.get(apiUrl)
      .subscribe(
        (response: any) => {
          if (response && response.status === 200 && response.exercise && response.exercise.length > 0) {
            const exercise = response.exercise[0];
            this.likedExercises.push({ ...exercise, isLiked: true });
          } else {
            console.error('Invalid exercise details response:', response);
          }
        },
        (error) => {
          console.error('Error fetching exercise details:', error);
        }
      );
  }

  // Toggle like status for an exercise
  toggleLike(exercise: any): void {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      alert('Please log in to like exercises!');
      return;
    }

    if (exercise.isLiked) {
      const apiUrl = `http://127.0.0.1:8000/api/user_like_exercise/${exercise.exercise_id}`;
      this.http.delete(apiUrl, { headers: { Authorization: `Bearer ${authToken}` } })
        .subscribe(
          () => {
            exercise.isLiked = false;
            this.likedExercises = this.likedExercises.filter((item) => item.exercise_id !== exercise.exercise_id);
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

  // Open popup with exercise details
  openPopup(exercise: any): void {
    this.selectedExercise = exercise;
    this.showPopup = true;
  }

  // Close popup
  closePopup(): void {
    this.showPopup = false;
    this.selectedExercise = null;
  }
}