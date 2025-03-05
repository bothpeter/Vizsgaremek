import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ValidationService } from '../services/validation.service';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-settings',
    imports: [CommonModule, FormsModule],
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
    userName: string = '';
    userEmail: string = '';
    userPhysique: any = {
        progress_picture: null,
        height: null,
        weight: null,
        age: null,
        gender: '',
        activity_level: '',
        goal: ''
    };
    emailError: string = '';
    selectedFile: File | null = null;
    errorMessage: string = '';
    successMessage: string = '';
    loading: boolean = false;

    constructor(private apiService: ApiService, private validationService: ValidationService, private authService: AuthService) { }

    ngOnInit(): void {
        this.userName = localStorage.getItem('userName') || '';
        this.userEmail = localStorage.getItem('userEmail') || '';
        this.fetchUserPhysique();
    }

    fetchUserPhysique(): void {
        this.apiService.get('user_physique').subscribe({
            next: (res: any) => {
                if (res.status === 200 && res.UserPhysique.length > 0) {
                    this.userPhysique = res.UserPhysique[0];
                }
            },
            error: () => {
                this.errorMessage = 'Hiba történt az adatok lekérése során.';
            }
        });
    }

    calculateDailyCalorieIntake(): number {
        const weight = parseFloat(this.userPhysique.weight);
        const height = parseFloat(this.userPhysique.height);
        const age = parseFloat(this.userPhysique.age);
        const gender = this.userPhysique.gender === 'ferfi' ? 'male' : 'female';

        let bmr: number;
        if (gender === 'male') {
            bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }

        let activityMultiplier: number;
        switch (this.userPhysique.activity_level) {
            case 'sedentary':
                activityMultiplier = 1.2;
                break;
            case 'light':
                activityMultiplier = 1.375;
                break;
            case 'moderate':
                activityMultiplier = 1.55;
                break;
            case 'active':
                activityMultiplier = 1.725;
                break;
            case 'veryActive':
                activityMultiplier = 1.9;
                break;
            default:
                activityMultiplier = 1.2;
        }

        let calories = bmr * activityMultiplier;

        if (this.userPhysique.goal === 'lose') {
            calories -= 500;
        } else if (this.userPhysique.goal === 'gain') {
            calories += 500;
        }

        return Math.round(calories);
    }

    saveUserData(): void {
        this.loading = true;
        this.emailError = '';
        if (!this.validationService.validateEmail(this.userEmail)) {
            this.emailError = 'Az e-mail cím érvénytelen formátumú.';
            return;
        }

        const dailyCalorieIntake = this.calculateDailyCalorieIntake();

        this.apiService.put('user', { name: this.userName, email: this.userEmail }).subscribe({
            next: (res: any) => {
                if (res.status === 200) {
                    localStorage.setItem('userName', this.userName);
                    localStorage.setItem('userEmail', this.userEmail);
                    this.successMessage = 'Felhasználói adatok sikeresen frissítve!';
                }
            },
            error: () => {
                this.errorMessage = 'Hiba történt a felhasználói adatok mentése során.';
            }
        });

        const formData = new FormData();
        if (this.selectedFile) {
            formData.append('progress_picture', this.selectedFile, this.selectedFile.name);
        }
        formData.append('height', this.userPhysique.height);
        formData.append('weight', this.userPhysique.weight);
        formData.append('age', this.userPhysique.age);
        formData.append('gender', this.userPhysique.gender);
        formData.append('daily_calorie_intake', dailyCalorieIntake.toString());
        formData.append('activity_level', this.userPhysique.activity_level);
        formData.append('goal', this.userPhysique.goal);

        const hasPhysiqueData = !!this.userPhysique.id;
        const apiEndpoint = 'user_physique';
        const url = hasPhysiqueData ? `${apiEndpoint}?_method=PUT` : apiEndpoint;

        this.apiService.postFormData(url, formData).subscribe({
            next: (res: any) => {
                this.loading = false;
                if (res.status === 200) {
                    this.successMessage = hasPhysiqueData
                        ? 'Fizikai adatok sikeresen frissítve!'
                        : 'Fizikai adatok sikeresen létrehozva!';
                    this.fetchUserPhysique();
                }
            },
            error: () => {
                this.loading = false;
                this.errorMessage = 'Hiba történt a fizikai adatok mentése során.';
            }
        });
    }

    onFileSelected(event: any): void {
        const file: File = event.target.files[0];
        if (file) {
            this.selectedFile = file;
            this.userPhysique.progress_picture = file;
        }
    }

    confirmDeleteUser(): void {
        const confirmation = confirm('Biztosan törölni szeretnéd a fiókod? Ez a művelet nem visszavonható!');
        if (confirmation) {
            this.authService.deleteUser();
        }
    }

    onDragOver(event: DragEvent): void {
        event.preventDefault();
    }

    onDrop(event: DragEvent): void {
        event.preventDefault();
        const file = event.dataTransfer?.files[0];
        if (file) {
            this.selectedFile = file;
            this.userPhysique.progress_picture = file;
        }
    }
}