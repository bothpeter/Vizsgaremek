import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginError: string = '';
  loginObj: Login;

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {
    this.loginObj = new Login();
  }

  onSubmit() {
    this.loginError = '';

    this.http.post('http://127.0.0.1:8000/api/login', this.loginObj).subscribe(
      (res: any) => {
        if (res.token != null) {
          const userId = res.user.id;
          const userName = res.user.name;
          const userEmail = res.user.email;
          const authToken = atob(res.token); // Decoded token from base64
          this.authService.login(authToken, userId, userName, userEmail);

          this.router.navigateByUrl('/');
        } else {
          console.log(res);
        }
      },
      (error) => {
        if (error.status === 401 && error.error.message === "Bad credentials") {
          this.loginError = "Hibás email, név vagy jelszó.";
        } else {
          alert("Hiba történt a bejelentkezés során. Kérjük, próbáld újra később.");
        }
      }
    );
  }
}

export class Login {
  login: string;
  password: string;

  constructor() {
    this.login = '';
    this.password = '';
  }
}