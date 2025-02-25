import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ValidationService } from '../services/validation.service';

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
        gender: ''
    };

    emailError: string = '';
    selectedFile: File | null = null;
    errorMessage: string = '';
    successMessage: string = '';

    constructor(private apiService: ApiService, private validationService: ValidationService) { }

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
                } else {
                    console.error('Nincs elérhető adat a felhasználó fizikumáról. A beállításokban tudod beállítani a fizikumodat.');
                }
            },
            error: () => {
                this.errorMessage = 'Hiba történt az adatok lekérése során.';
            }
        });
    }

    saveUserData(): void {
        this.emailError = '';
        if (!this.validationService.validateEmail(this.userEmail)) {
            this.emailError = 'Az e-mail cím érvénytelen formátumú.';
            return;
        }

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

        const hasPhysiqueData = !!this.userPhysique.id;
        const apiEndpoint = 'user_physique';
        const url = hasPhysiqueData ? `${apiEndpoint}?_method=PUT` : apiEndpoint;

        this.apiService.postFormData(url, formData).subscribe({
            next: (res: any) => {
                if (res.status === 200) {
                    this.successMessage = hasPhysiqueData
                        ? 'Fizikai adatok sikeresen frissítve!'
                        : 'Fizikai adatok sikeresen létrehozva!';
                    this.fetchUserPhysique();
                }
            },
            error: () => {
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
}