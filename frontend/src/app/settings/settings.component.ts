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
  errorMessage: string = '';
  successMessage: string = '';

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
      (error) => {
        this.errorMessage = 'Hiba történt az adatok lekérése során.';
      }
    );
  }

  isFormInvalid(): boolean {
    return (
      !this.userName ||
      !this.userEmail ||
      !this.userPhysique.height ||
      !this.userPhysique.weight ||
      !this.userPhysique.age ||
      !this.userPhysique.gender
    );
  }

  saveUserData(): void {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      this.errorMessage = 'Nincs érvényes hitelesítési token.';
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json'
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

    const apiEndpoint = this.userPhysique.id ? 'http://127.0.0.1:8000/api/user_physique' : 'http://127.0.0.1:8000/api/user_physique';
    const method = this.userPhysique.id ? 'put' : 'post';

    this.http[method](
      apiEndpoint,
      {
        height: this.userPhysique.height,
        weight: this.userPhysique.weight,
        age: this.userPhysique.age,
        gender: this.userPhysique.gender
      },
      { headers }
    ).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.successMessage = 'Fizikai adatok sikeresen frissítve!';
          this.fetchUserPhysique();
        }
      },
      (error) => {
        this.errorMessage = 'Hiba történt a fizikai adatok mentése során.';
      }
    );
  }
}