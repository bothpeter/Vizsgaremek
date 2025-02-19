import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  emailError: string = '';
  nameError: string = '';
  passwordError: string = '';

  registerObj: Register;

  constructor(private http: HttpClient, private router: Router) {
    this.registerObj = new Register();
  }

  onSubmit() {
    this.emailError = '';
    this.nameError = '';
    this.passwordError = '';

    if (this.registerObj.password !== this.registerObj.password_confirmation) {
      alert('A jelszavak nem egyeznek!');
      return;
    }

    const passwordValidation = this.validatePassword(this.registerObj.password);
    if (!passwordValidation.isValid) {
      this.passwordError = passwordValidation.errorMessage;
      return;
    }

    if (!this.validateEmail(this.registerObj.email)) {
      this.emailError = 'Az e-mail cím érvénytelen formátumú.';
      return;
    }

    this.http.post('http://127.0.0.1:8000/api/register', this.registerObj).subscribe(
      (res: any) => {
        if (res.token != null) {
          const authToken = atob(res.token); // Decoded token from base64
          this.router.navigateByUrl('/login');
        } else {
          console.log(res.message);
        }
      },
      (error) => {
        if (error.status === 422 && error.error) {
          const errors = error.error;

          if (errors.name) {
            this.nameError = "Ez a felhasználónév már foglalt.";
          }
          if (errors.email) {
            this.emailError = "Ez az e-mail cím már foglalt.";
          }
        } else {
          alert('Hiba történt a regisztráció során. Kérjük, próbáld újra később.');
        }
      }
    );
  }

  validateEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
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
    if (this.registerObj.password === this.registerObj.password_confirmation) {
      this.passwordError = '';
    }
    this.validatePassword(this.registerObj.password);
  }
}

export class Register {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;

  constructor() {
    this.name = '';
    this.email = '';
    this.password = '';
    this.password_confirmation = '';
  }
}