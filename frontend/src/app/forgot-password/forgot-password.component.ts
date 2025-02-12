import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email: string = '';
  apiResponse: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    this.apiResponse = '';
    const payload = { email: this.email };

    this.http.post('http://127.0.0.1:8000/api/forgot_password', payload).subscribe(
      (res: any) => {
        localStorage.setItem('resetEmail', this.email);
        this.router.navigateByUrl('/reset-password');
      },
      (error) => {
        if (error.status === 404 && error.error.message === "No record found") {
          this.apiResponse = 'Hiba történt a kérés során. Kérjük, próbáld újra később.';
        } else {
          this.apiResponse = 'Az e-mail cím nem található';
        }
      }
    );
  }
}