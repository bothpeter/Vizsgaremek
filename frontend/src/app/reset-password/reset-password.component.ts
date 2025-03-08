import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { ValidationService } from '../services/validation.service';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-reset-password',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, CommonModule],
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.css']
})

export class ResetPasswordComponent {
    loading: boolean = false;
    apiError: string = '';
    resendSuccess: string = '';
    hidePassword: boolean = true;
    hideConfirmPassword: boolean = true;
    resetPasswordForm: FormGroup;

    constructor(
        private apiService: ApiService,
        private validationService: ValidationService,
        private router: Router,
        private fb: FormBuilder
    ) {
        this.resetPasswordForm = this.fb.group({
            token: ['', [Validators.required]],
            password: ['', [Validators.required]],
            password_confirmation: ['', [Validators.required]]
        });
    }

    onSubmit(): void {
        if (this.resetPasswordForm.invalid || 
            this.resetPasswordForm.value.password !== this.resetPasswordForm.value.password_confirmation) {
            this.markFormGroupTouched(this.resetPasswordForm);
            return;
        }

        const passwordValidation = this.validationService.validatePassword(this.resetPasswordForm.value.password);
        if (!passwordValidation.isValid) {
            return;
        }

        this.loading = true;
        this.apiError = '';
        this.resendSuccess = '';

        const email = localStorage.getItem('resetEmail');
        const payload = {
            email: email,
            token: this.resetPasswordForm.value.token,
            password: this.resetPasswordForm.value.password,
            password_confirmation: this.resetPasswordForm.value.password_confirmation
        };

        this.apiService.post('reset_password', payload)
            .pipe(finalize(() => this.loading = false))
            .subscribe({
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

    resendCode(): void {
        this.apiError = '';
        this.resendSuccess = '';
        const email = localStorage.getItem('resetEmail');
        const payload = { email: email };

        this.apiService.post('forgot_password', payload).subscribe({
            next: () => {
                this.resendSuccess = 'Az új kód sikeresen elküldve.';
            },
            error: (error) => {
                this.apiError = 'Hiba történt a kérés során. Kérjük, próbáld újra később.';
            }
        });
    }

    onPasswordChange(): void {
        const password = this.resetPasswordForm.get('password')?.value;
        const confirmPassword = this.resetPasswordForm.get('password_confirmation')?.value;

        if (password !== confirmPassword) {
            this.resetPasswordForm.get('password_confirmation')?.setErrors({ mismatch: true });
        } else {
            this.resetPasswordForm.get('password_confirmation')?.setErrors(null);
        }

        const passwordValidation = this.validationService.validatePassword(password);
        if (!passwordValidation.isValid) {
            this.resetPasswordForm.get('password')?.setErrors({ invalid: passwordValidation.errorMessage });
        }
    }

    togglePasswordVisibility(): void {
        this.hidePassword = !this.hidePassword;
    }

    toggleConfirmPasswordVisibility(): void {
        this.hideConfirmPassword = !this.hideConfirmPassword;
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
        const control = this.resetPasswordForm.get(controlName);
        return !!control && control.touched && control.hasError(errorName);
    }
}