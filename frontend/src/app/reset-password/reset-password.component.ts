import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  token: string = '';
  password: string = '';
  password_confirmation: string = '';
  apiResponse: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    this.apiResponse = '';
    const email = localStorage.getItem('resetEmail'); // E-mail lekérése a helyi tárolóból
    const payload = {
      email: email,
      token: this.token,
      password: this.password,
      password_confirmation: this.password_confirmation
    };

    this.http.post('http://127.0.0.1:8000/api/reset_password', payload).subscribe(
      (res: any) => {
        this.apiResponse = res.message;
        localStorage.removeItem('resetEmail'); // E-mail törlése a helyi tárolóból
        this.router.navigateByUrl('/login'); // Átirányítás a bejelentkezési oldalra
      },
      (error) => {
        if (error.status === 404 && error.error.message === "Token mismatch") {
          this.apiResponse = 'Hiba történt a kérés során. Kérjük, próbáld újra később.';
        } else {
          this.apiResponse = 'A kód hibás vagy lejárt.';
        }
      }
    );
  }
}