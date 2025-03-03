import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ValidationService } from '../services/validation.service';

@Component({
    selector: 'app-reset-password',
    standalone: true,
    imports: [FormsModule, CommonModule],
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.css']
})

export class ResetPasswordComponent {
    token: string = '';
    password: string = '';
    password_confirmation: string = '';
    apiError: string = '';
    passwordError: string = '';
    resendSuccess: string = '';

    constructor(private apiService: ApiService, private validationService: ValidationService, private router: Router) { }

    onSubmit() {
        this.apiError = '';
        this.resendSuccess = '';
        this.passwordError = '';

        const passwordValidation = this.validationService.validatePassword(this.password);
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

        this.apiService.post('reset_password', payload).subscribe({
            next: () => {
                localStorage.removeItem('resetEmail');
                this.router.navigateByUrl('/login');
            },
            error: (error) => {
                if (error.status === 404 && error.error.message === "Token mismatch") {
                    this.apiError = 'Hiba történt a kérés során. Kérjük, próbáld újra később.';
                } else {
                    this.apiError = 'A kód hibás vagy lejárt.';
                }
            }
        });
    }

    resendCode() {
        this.apiError = '';
        this.resendSuccess = '';
        const email = localStorage.getItem('resetEmail');
        const payload = { email: email };

        this.apiService.post('forgot_password', payload).subscribe({
            next: () => {
                this.resendSuccess = 'Az új kód sikeresen elküldve.';
            },
            error: (error) => {
                this.apiError = 'Hiba történt a kérés során. Kérjük, próbáld újra később.', error;
            }
        });
    }

    onPasswordChange(): void {
        if (this.password === this.password_confirmation) {
            this.passwordError = '';
        }
        const passwordValidation = this.validationService.validatePassword(this.password);
        if (!passwordValidation.isValid) {
            this.passwordError = passwordValidation.errorMessage;
        } else {
            this.passwordError = '';
        }
    }
}