import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { VerticalNavUserComponent } from '../components/vertical-nav-user/vertical-nav-user.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-settings',
    imports: [VerticalNavUserComponent, CommonModule, FormsModule],
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
    selectedFile: File | null = null;
    errorMessage: string = '';
    successMessage: string = '';

    constructor(private http: HttpClient) { }

    ngOnInit(): void {
        this.userName = localStorage.getItem('userName') || '';
        this.userEmail = localStorage.getItem('userEmail') || '';

        this.fetchUserPhysique();
    }

    fetchUserPhysique(): void {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            alert('Nincs érvényes hitelesítési token.');
            return;
        }

        const headers = new HttpHeaders({
            Authorization: `Bearer ${authToken}`
        });

        this.http.get('http://127.0.0.1:8000/api/user_physique', { headers }).subscribe(
            (response: any) => {
                if (response.status === 200 && response.UserPhysique.length > 0) {
                    this.userPhysique = response.UserPhysique[0];
                }
            },
            (error) => {
                this.errorMessage = 'Hiba történt az adatok lekérése során.';
            }
        );
    }

    onFileSelected(event: any): void {
        const file: File = event.target.files[0];
        if (file) {
            this.selectedFile = file;
            this.userPhysique.progress_picture = file;
        }
    }

    isFormInvalid(): boolean {
        return (
            !this.userName ||
            !this.userEmail ||
            !this.userPhysique.gender ||
            !this.userPhysique.height ||
            !this.userPhysique.weight ||
            !this.userPhysique.age
        );
    }

    saveUserData(): void {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            this.errorMessage = 'Nincs érvényes hitelesítési token.';
            return;
        }

        const headers = new HttpHeaders({
            Authorization: `Bearer ${authToken}`
        });

        this.http.put(
            'http://127.0.0.1:8000/api/user',
            { name: this.userName, email: this.userEmail },
            { headers }
        ).subscribe(
            (response: any) => {
                if (response.status === 200) {
                    localStorage.setItem('userName', this.userName);
                    localStorage.setItem('userEmail', this.userEmail);
                    this.successMessage = 'Felhasználói adatok sikeresen frissítve!';
                }
            },
            (error) => {
                this.errorMessage = 'Hiba történt a felhasználói adatok mentése során.';
            }
        );

        const formData = new FormData();
        if (this.selectedFile) {
            formData.append('progress_picture', this.selectedFile, this.selectedFile.name);
        }
        formData.append('height', this.userPhysique.height);
        formData.append('weight', this.userPhysique.weight);
        formData.append('age', this.userPhysique.age);
        formData.append('gender', this.userPhysique.gender);

        const hasPhysiqueData = !!this.userPhysique.id;

        const apiEndpoint = 'http://127.0.0.1:8000/api/user_physique';
        const url = hasPhysiqueData ? `${apiEndpoint}?_method=PUT` : apiEndpoint;

        this.http.post(
            url,
            formData,
            { headers }
        ).subscribe(
            (response: any) => {
                if (response.status === 200) {
                    this.successMessage = hasPhysiqueData
                        ? 'Fizikai adatok sikeresen frissítve!'
                        : 'Fizikai adatok sikeresen létrehozva!';
                    this.fetchUserPhysique();
                }
            },
            (error) => {
                this.errorMessage = 'Hiba történt a fizikai adatok mentése során.';
            }
        );
    }
}