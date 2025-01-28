import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  emailError: string = '';

  onSubmit() {
    this.emailError = '';

    if (this.password !== this.confirmPassword) {
      alert('A jelszavak nem egyeznek!');
      return;
    }

    if (!this.validateEmail(this.email)) {
      this.emailError = 'Az e-mail cím érvénytelen formátumú.';
      return;
    }

    console.log('Felhasználónév:', this.username);
    console.log('E-mail:', this.email);
    console.log('Jelszó:', this.password);

    // regisztrációs API
  }

  validateEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }
}
