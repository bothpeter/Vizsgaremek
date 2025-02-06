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

  registerObj: Register;

  constructor(private http: HttpClient, private router: Router) {
    this.registerObj = new Register();
  }

  onSubmit() {
    this.emailError = '';

    if (this.registerObj.password !== this.registerObj.password_confirmation) {
      alert('A jelszavak nem egyeznek!');
      return;
    }

    if (!this.validateEmail(this.registerObj.email)) {
      this.emailError = 'Az e-mail cím érvénytelen formátumú.';
      return;
    }

    this.http.post('http://127.0.0.1:8000/api/register', this.registerObj).subscribe((res: any) => {
      if (res.token!=null) {
        const authToken = atob(res.token); //Decoded token from base64
        console.log(authToken)
        this.router.navigateByUrl('/')
        alert("Sikeres Regisztráció")
      } else {
        console.log(res.message);
      }
    });

  }

  validateEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
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