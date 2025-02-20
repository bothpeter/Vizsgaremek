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
  
  nameError: string = '';
  emailError: string = '';
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

  saveUserData(): void {
    this.nameError = '';
    this.emailError = '';
    this.generalMessage = '';
    this.isError = false;

    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      this.generalMessage = 'Nincs érvényes hitelesítési token.';
      this.isError = true;
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    });

    let userSuccess = false;
    let physiqueSuccess = false;

    this.http.put(
      'http://127.0.0.1:8000/api/user',
      { name: this.userName, email: this.userEmail },
      { headers }
    ).subscribe(
      (response: any) => {
        if (response.status === 200) {
          localStorage.setItem('userName', this.userName);
          localStorage.setItem('userEmail', this.userEmail);
          userSuccess = true;
          this.updateGeneralMessage(userSuccess, physiqueSuccess);
        }
      },
      (error) => {
        if (error.status === 422 && error.error.errors) {
          const errors = error.error.errors;
          if (errors.name) this.nameError = 'A név már foglalt.';
          if (errors.email) this.emailError = 'Az e-mail már foglalt.';
        } else {
          this.generalMessage = 'Személyes adatok frissítése sikertelen.';
          this.isError = true;
        }
      }
    );

    const apiEndpoint = this.userPhysique.id 
      ? 'http://127.0.0.1:8000/api/user_physique' 
      : 'http://127.0.0.1:8000/api/user_physique';
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
          physiqueSuccess = true;
          this.updateGeneralMessage(userSuccess, physiqueSuccess);
        }
      },
      () => {
        this.generalMessage = 'Fizikai adatok frissítése sikertelen.';
        this.isError = true;
      }
    );
  }

  updateGeneralMessage(userSuccess: boolean, physiqueSuccess: boolean) {
    if (userSuccess && physiqueSuccess) {
      this.generalMessage = 'Adatok frissítése sikeres.';
      this.isError = false;
    } else {
      this.generalMessage = '';
      if (!userSuccess) this.generalMessage += 'Személyes adatok frissítése sikertelen.\n';
      if (!physiqueSuccess) this.generalMessage += 'Fizikai adatok frissítése sikertelen.';
      this.isError = true;
    }
  }
}
