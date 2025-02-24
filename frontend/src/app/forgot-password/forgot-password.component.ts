import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [FormsModule, CommonModule, RouterLink],
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
    resetEmail: string = '';
    emailError: string = '';

    constructor(private apiService: ApiService, private router: Router) { }

    onSubmit() {
        this.emailError = '';
        const payload = { email: this.resetEmail };

        this.apiService.post('forgot_password', payload).subscribe({
            next: () => {
                localStorage.setItem('resetEmail', this.resetEmail);
                this.router.navigateByUrl('/reset-password');
            },
            error: (error) => {
                if (error.status === 404 && error.error.message === "No record found") {
                    this.emailError = 'Hiba történt a kérés során. Kérjük, próbáld újra később.';
                } else {
                    this.emailError = 'Az e-mail cím nem található';
                }
            }
        });
    }
}