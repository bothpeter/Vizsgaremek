import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
    resetEmail: string = '';
    emailError: string = '';
    loading: boolean = false;

    constructor(private apiService: ApiService, private router: Router) { }

    onSubmit() {
        this.loading = true;
        this.emailError = '';
        const payload = { email: this.resetEmail };

        this.apiService.post('forgot_password', payload).subscribe({
            next: () => {
                this.loading = false;
                localStorage.setItem('resetEmail', this.resetEmail);
                this.router.navigateByUrl('/reset-password');
            },
            error: (error) => {
                this.loading = false;
                if (error.status === 404 && error.error.message === "No record found") {
                    this.emailError = 'Hiba történt a kérés során. Kérjük, próbáld újra később.';
                } else {
                    this.emailError = 'Az e-mail cím nem található';
                }
            }
        });
    }
}