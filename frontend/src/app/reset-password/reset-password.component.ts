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
  passwordError: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    this.apiResponse = '';
    this.passwordError = '';

    if (this.password !== this.password_confirmation) {
      this.passwordError = 'A jelszavak nem egyeznek.';
      return;
    }

    const passwordValidation = this.validatePassword(this.password);
    if (!passwordValidation.isValid) {
      this.passwordError = passwordValidation.errorMessage;
      return;
    }

    const email = localStorage.getItem('resetEmail');
    const payload = {
      email: email,
      token: this.token,
      password: this.password,
      password_confirmation: this.password_confirmation
    };

    this.http.post('http://127.0.0.1:8000/api/reset_password', payload).subscribe(
      (res: any) => {
        this.apiResponse = res.message;
        localStorage.removeItem('resetEmail');
        this.router.navigateByUrl('/login');
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

  validatePassword(password: string): { isValid: boolean, errorMessage: string } {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return { isValid: false, errorMessage: 'A jelszónak legalább 8 karakter hosszúnak kell lennie.' };
    }
    if (!hasUpperCase) {
      return { isValid: false, errorMessage: 'A jelszónak tartalmaznia kell legalább egy nagybetűt.' };
    }
    if (!hasNumber) {
      return { isValid: false, errorMessage: 'A jelszónak tartalmaznia kell legalább egy számot.' };
    }
    if (!hasSpecialChar) {
      return { isValid: false, errorMessage: 'A jelszónak tartalmaznia kell legalább egy speciális karaktert.' };
    }

    this.passwordError = '';
    return { isValid: true, errorMessage: '' };
  }

  onPasswordChange() {
    if (this.password === this.password_confirmation) {
      this.passwordError = '';
    }
    this.validatePassword(this.password);
  }
}