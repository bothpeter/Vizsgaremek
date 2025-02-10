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
  loginObj: Login;

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {
    this.loginObj = new Login();
  }

  onSubmit() {
    this.http.post('http://127.0.0.1:8000/api/login', this.loginObj).subscribe((res: any) => {
      if (res.token!=null) {
        const authToken = atob(res.token); //Decoded token from base64
        this.authService.login(authToken); //Update the login state
        console.log(authToken)
        this.router.navigateByUrl('/')
        alert("Sikeres Bejelentkezés")
      } else {
        console.log(res);
      }
    });
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