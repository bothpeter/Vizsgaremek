import { Component, OnInit } from '@angular/core';
import { ExerciseService } from '../services/exercise.service';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginPopupComponent } from '../components/login-popup/login-popup.component';

@Component({
    selector: 'app-exercises',
    standalone: true,
    imports: [CommonModule, FormsModule, LoginPopupComponent],
    templateUrl: './exercises.component.html',
    styleUrls: ['./exercises.component.css'],
})

export class ExercisesComponent implements OnInit {
    exercises: any[] = [];
    selectedExercise: any = null;
    uploaderData: any = null;
    selectedType: string = 'all';
    selectedMuscleGroup: string = 'all';
    showPopup: boolean = false;
    showLoginPopup: boolean = false;
    searchQuery = '';
    loading: boolean = false;
    selectedExerciseUploader: any = null;

    showAddExercisePopup: boolean = false;
    newExercise: any = {
        exercise_name: '',
        muscle_group: '',
        description: '',
        type: 'cardio',
        imgFile: null,
    };

    constructor(private exerciseService: ExerciseService, private authService: AuthService) { }

    ngOnInit(): void {
        this.fetchUploaderData();
        this.fetchExercises();
        this.fetchLikedExercises();
    }

    fetchUploaderData(): void {
        this.exerciseService.getUploaderData().subscribe({
            next: (data) => {
                this.uploaderData = data.users;
            },
            error: (error) => console.error('Error fetching uploader data:', error),
        });
    }

    fetchExercises(): void {
        this.loading = true;
        this.exerciseService.getExercises().subscribe({
            next: (data) => {
                this.loading = false
                this.exercises = data.exercise;
            },
            error: (error) => {
                this.loading = false;
                console.error('Error fetching exercises:', error);
            }
        });
    }

    fetchLikedExercises(): void {
        if (!this.authService.isAuthenticated()) return;

        this.exerciseService.getLikedExercises().subscribe({
            next: (data) => {
                const likedExerciseIds = data.userLikeExercise.map(
                    (item: any) => item.exercise_id
                );
                this.exercises.forEach((exercise) => {
                    exercise.isLiked = likedExerciseIds.includes(exercise.exercise_id);
                });
            },
            error: (error) => console.error('Error fetching liked exercises:', error),
        });
    }

    toggleLike(exercise: any): void {
        if (!this.authService.isAuthenticated()) {
            this.showLoginPopup = true;
            return;
        }

        const wasLiked = exercise.isLiked;
        exercise.isLiked = !wasLiked;

        this.exerciseService.toggleLike(exercise.exercise_id, wasLiked).subscribe({
            error: (error) => {
                console.error('Error toggling like:', error);
                exercise.isLiked = wasLiked;
            }
        });
    }
    addExercise(): void {
        if (!this.authService.isAuthenticated()) {
            alert('Kérjük, jelentkezzen be, a gyakorlat hozzáadásához!');
            return;
        }

        const formData = new FormData();
        Object.keys(this.newExercise).forEach(key => {
            formData.append(key, this.newExercise[key]);
        });
        if (this.newExercise.imgFile) {
            formData.append('img', this.newExercise.imgFile);
        }

        this.exerciseService.addExercise(formData).subscribe({
            next: () => {
                this.fetchExercises();
                this.closeAddExercisePopup();
            },
            error: (error) => console.error('Error adding exercise:', error),
        });
    }

    openAddExercisePopup(): void {
        if (!this.authService.isAuthenticated()) {
            this.showLoginPopup = true;
            return;
        }
        this.showAddExercisePopup = true;
    }

    closeAddExercisePopup(): void {
        this.showAddExercisePopup = false;
        this.resetNewExerciseForm();
    }

    resetNewExerciseForm(): void {
        this.newExercise = {
            exercise_name: '',
            muscle_group: '',
            description: '',
            type: 'cardio',
            imgFile: null,
        };
    }

    openPopup(exercise: any): void {
        this.selectedExercise = exercise;
        if (this.uploaderData) {
            this.selectedExerciseUploader = this.uploaderData.find(
                (user: any) => user.id === this.selectedExercise.user_id
            );
        }
        this.showPopup = true;
    }

    closePopup(): void {
        this.showPopup = false;
        this.selectedExercise = null;
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

    changeMuscleGroup(muscleGroup: string): void {
        this.selectedMuscleGroup = muscleGroup;
    }

    onFileSelected(event: any): void {
        const file = event.target.files[0];
        if (file) {
            this.newExercise.imgFile = file;
        }
    }

    onDragOver(event: DragEvent): void {
        event.preventDefault();
    }

    onDrop(event: DragEvent): void {
        event.preventDefault();
        const file = event.dataTransfer?.files[0];
        if (file) {
            this.newExercise.imgFile = file;
        }
    }

    get filteredExercises() {
        return this.exercises.filter(exercise => {
            const matchesSearch = exercise.exercise_name.toLowerCase().includes(this.searchQuery.toLowerCase());
            const matchesMuscleGroup = this.selectedMuscleGroup === 'all' || exercise.muscle_group === this.selectedMuscleGroup;
            const matchesType = this.selectedType === 'all' || exercise.type === this.selectedType;
            return matchesSearch && matchesMuscleGroup && matchesType;
        });
    }

    clearSearch() {
        this.searchQuery = '';
    }
}