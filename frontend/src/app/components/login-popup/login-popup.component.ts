import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { AuthService, LoginCredentials } from '../../services/auth.service';

@Component({
    selector: 'app-login-popup',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
    templateUrl: './login-popup.component.html',
    styleUrl: './login-popup.component.css'
})
export class LoginPopupComponent {
    showLoginPopup: boolean = false;
    loading: boolean = false;
    loginError: string = '';
    loginForm: FormGroup;
    hidePassword: boolean = true;

    constructor(
        private router: Router,
        private authService: AuthService,
        private fb: FormBuilder
    ) {
        this.loginForm = this.fb.group({
            login: ['', [Validators.required]],
            password: ['', [Validators.required]]
        });
    }

    onSubmit(): void {
        if (this.loginForm.invalid) {
            this.markFormGroupTouched(this.loginForm);
            return;
        }

        const credentials: LoginCredentials = {
            login: this.loginForm.value.login,
            password: this.loginForm.value.password
        };

        this.loading = true;
        this.loginError = '';

        this.authService.attemptLogin(credentials)
            .pipe(finalize(() => this.loading = false))
            .subscribe({
                next: () => {
                    this.closeLoginPopup();
                    this.router.navigateByUrl('/');
                },
                error: (error) => {
                    this.loginError = error.message || "Bejelentkezés sikertelen. Kérjük, próbálja újra.";
                }
            });
    }

    private markFormGroupTouched(formGroup: FormGroup): void {
        Object.values(formGroup.controls).forEach(control => {
            control.markAsTouched();
            if ((control as any).controls) {
                this.markFormGroupTouched(control as FormGroup);
            }
        });
    }

    hasError(controlName: string, errorName: string): boolean {
        const control = this.loginForm.get(controlName);
        return !!control && control.touched && control.hasError(errorName);
    }

    togglePasswordVisibility(): void {
        this.hidePassword = !this.hidePassword;
    }

    openLoginPopup(): void {
        this.showLoginPopup = true;
        this.loginForm.reset();
        this.loginError = '';
    }

    closeLoginPopup(): void {
        this.showLoginPopup = false;
        this.loginForm.reset();
        this.loginError = '';
    }
}