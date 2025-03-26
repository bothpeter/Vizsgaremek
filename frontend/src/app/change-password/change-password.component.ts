import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ValidationService } from '../services/validation.service';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-change-password',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, CommonModule],
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.css']
})

export class ChangePasswordComponent {
    loading: boolean = false;
    passwordError: string = '';
    hidePassword: boolean = true;
    hideConfirmPassword: boolean = true;
    changePasswordForm: FormGroup;

    constructor(
        private router: Router,
        private validationService: ValidationService,
        private apiService: ApiService,
        private authService: AuthService,
        private fb: FormBuilder
    ) {
        this.changePasswordForm = this.fb.group({
            password: ['', [Validators.required]],
            password_confirmation: ['', [Validators.required]]
        });
    }

    onSubmit(): void {
        if (this.changePasswordForm.invalid || this.changePasswordForm.value.password !== this.changePasswordForm.value.password_confirmation) {
            this.markFormGroupTouched(this.changePasswordForm);
            return;
        }

        const passwordValidation = this.validationService.validatePassword(this.changePasswordForm.value.password);
        if (!passwordValidation.isValid) {
            return;
        }

        this.loading = true;
        this.passwordError = '';

        const payload = {
            password: this.changePasswordForm.value.password,
            password_confirmation: this.changePasswordForm.value.password_confirmation
        };

        this.apiService.put('user', payload)
            .pipe(finalize(() => this.loading = false))
            .subscribe({
                next: () => {
                    this.router.navigateByUrl('/user');
                },
                error: (error) => {
                    this.passwordError = error.message || 'Hiba történt a jelszó módosítása során. Kérjük, próbáld újra később.';
                }
            });
    }

    onPasswordChange(): void {
        const password = this.changePasswordForm.get('password')?.value;
        const confirmPassword = this.changePasswordForm.get('password_confirmation')?.value;

        if (password !== confirmPassword) {
            this.changePasswordForm.get('password_confirmation')?.setErrors({ mismatch: true });
        } else {
            this.changePasswordForm.get('password_confirmation')?.setErrors(null);
        }

        const passwordValidation = this.validationService.validatePassword(password);
        if (!passwordValidation.isValid) {
            this.changePasswordForm.get('password')?.setErrors({ invalid: passwordValidation.errorMessage });
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
        const control = this.changePasswordForm.get(controlName);
        return !!control && control.touched && control.hasError(errorName);
    }
}