import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { VerticalNavUserComponent } from '../components/vertical-nav-user/vertical-nav-user.component';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule, VerticalNavUserComponent],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  password: string = '';
  password_confirmation: string = '';
  passwordError: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
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

    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
      this.passwordError = 'Nincs bejelentkezve. Kérjük, jelentkezzen be újra.';
      return;
    }

    const payload = {
      password: this.password,
    };

    this.http.put('http://127.0.0.1:8000/api/user', payload, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    }).subscribe(
      (res: any) => {
        alert('A jelszó sikeresen módosítva!');
        this.router.navigateByUrl('/user');
      },
      (error) => {
        this.passwordError = 'Hiba történt a jelszó módosítása során. Kérjük, próbáld újra később.';
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

    return { isValid: true, errorMessage: '' };
  }

  onPasswordChange() {
    if (this.password === this.password_confirmation) {
      this.passwordError = '';
    }
    this.validatePassword(this.password);
  }
}