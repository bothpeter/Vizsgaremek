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
    height: null,
    weight: null,
    age: null,
    gender: ''
  };

  selectedFile: File | null = null; // For profile picture
  nameError: string = '';
  emailError: string = '';
  profilePictureError: string = '';
  generalMessage: string = '';
  isError: boolean = false;

  constructor(private http: HttpClient) {}

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
      () => {
        this.generalMessage = 'Fizikai adatok frissítése sikertelen.';
        this.isError = true;
      }
    );
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  saveUserData(): void {
    this.nameError = '';
    this.emailError = '';
    this.profilePictureError = '';
    this.generalMessage = '';
    this.isError = false;

    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      this.generalMessage = 'Nincs érvényes hitelesítési token.';
      this.isError = true;
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`
    });

    // Create FormData for the request
    const formData = new FormData();
    if (this.selectedFile) {
      formData.append('progress_picture', this.selectedFile);
    }
    formData.append('name', this.userName);
    formData.append('email', this.userEmail);
    formData.append('height', this.userPhysique.height);
    formData.append('weight', this.userPhysique.weight);
    formData.append('age', this.userPhysique.age);
    formData.append('gender', this.userPhysique.gender);

    

    this.http.put('http://127.0.0.1:8000/api/user', formData, { headers }).subscribe(
      (response: any) => {
        if (response.status === 200) {
          localStorage.setItem('userName', this.userName);
          localStorage.setItem('userEmail', this.userEmail);
          this.generalMessage = 'Adatok frissítése sikeres.';
          this.isError = false;
        }
      },
      (error) => {
        if (error.status === 422 && error.error.errors) {
          const errors = error.error.errors;
          if (errors.name) this.nameError = 'A név már foglalt.';
          if (errors.email) this.emailError = 'Az e-mail már foglalt.';
          if (errors.progress_picture) this.profilePictureError = 'A profilkép feltöltése kötelező.';
        } else {
          this.generalMessage = 'Személyes adatok frissítése sikertelen.';
          this.isError = true;
        }
      }
    );
  }
}