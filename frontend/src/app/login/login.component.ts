import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginObj: Login;

  constructor(private http: HttpClient, private router: Router) {
    this.loginObj = new Login();
  }

  onSubmit() {
    this.http.post('http://127.0.0.1:8000/api/login', this.loginObj).subscribe((res: any) => {
      if (res.token!=null) {
        const authToken = atob(res.token); //Decoded token from base64
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
  email: string;
  password: string;

  constructor() {
    this.email = '';
    this.password = '';
  }
}