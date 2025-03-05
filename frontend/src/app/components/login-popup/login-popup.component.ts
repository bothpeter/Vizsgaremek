import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-login-popup',
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './login-popup.component.html',
    styleUrl: './login-popup.component.css'
})

export class LoginPopupComponent {
    showLoginPopup: boolean = false;

    loginError: string = '';
    loginObj: Login = {
        login: '',
        password: ''
    };

    constructor(private apiService: ApiService, private router: Router, private authService: AuthService) { }

    onSubmit() {
        this.loginError = '';

        this.apiService.post('login', this.loginObj).subscribe({
            next: (res: any) => {
                if (res.token != null) {
                    const userId = res.user.id;
                    const userName = res.user.name;
                    const userEmail = res.user.email;
                    const authToken = res.token; // Decoded token from base64
                    this.authService.login(authToken, userId, userName, userEmail);

                    this.router.navigateByUrl('/');
                } else {
                    this.loginError = "Bejelentkezés sikertelen. Kérjük, próbálja újra.";
                }
            },
            error: (error) => {
                if (error.status === 401 && error.error.message === "Bad credentials") {
                    this.loginError = "Hibás email, név vagy jelszó.";
                } else {
                    this.loginError = "Hiba történt a bejelentkezés során. Kérjük, próbáld újra később.";
                }
            }
        });
    }

    openLoginPopup(): void {
        this.showLoginPopup = true;
    }

    closeLoginPopup(): void {
        this.showLoginPopup = false;
    }
}

export interface Login {
    login: string;
    password: string;
}