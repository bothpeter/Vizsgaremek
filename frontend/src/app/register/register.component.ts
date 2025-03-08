import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { RegisterService } from '../services/register.service';
import { ValidationService } from '../services/validation.service';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterLink],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
})

export class RegisterComponent {
    loading: boolean = false;
    registerError: string = '';
    hidePassword: boolean = true;
    hideConfirmPassword: boolean = true;
    registerForm: FormGroup;

    constructor(
        private router: Router,
        private registerService: RegisterService,
        private validationService: ValidationService,
        private fb: FormBuilder
    ) {
        this.registerForm = this.fb.group({
            name: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]],
            password_confirmation: ['', [Validators.required]]
        });
    }

    onSubmit(): void {
        if (this.registerForm.invalid || this.registerForm.value.password !== this.registerForm.value.password_confirmation) {
            this.markFormGroupTouched(this.registerForm);
            return;
        }

        const passwordValidation = this.validationService.validatePassword(this.registerForm.value.password);
        if (!passwordValidation.isValid) {
            return;
        }

        this.loading = true;
        this.registerError = '';

        const registerObj = {
            name: this.registerForm.value.name,
            email: this.registerForm.value.email,
            password: this.registerForm.value.password,
            password_confirmation: this.registerForm.value.password_confirmation
        };

        this.registerService.register(registerObj)
            .pipe(finalize(() => this.loading = false))
            .subscribe({
                next: () => {
                    this.router.navigateByUrl('/login');
                },
                error: (error) => {
                    if (error.name) {
                        this.registerForm.get('name')?.setErrors({ taken: true });
                    }
                    if (error.email) {
                        this.registerForm.get('email')?.setErrors({ taken: true });
                    }
                    this.registerError = error.message || "Regisztráció sikertelen. Kérjük, próbálja újra.";
                },
            });
    }

    onPasswordChange(): void {
        const password = this.registerForm.get('password')?.value;
        const confirmPassword = this.registerForm.get('password_confirmation')?.value;

        if (password !== confirmPassword) {
            this.registerForm.get('password_confirmation')?.setErrors({ mismatch: true });
        } else {
            this.registerForm.get('password_confirmation')?.setErrors(null);
        }

        const passwordValidation = this.validationService.validatePassword(password);
        if (!passwordValidation.isValid) {
            this.registerForm.get('password')?.setErrors({ invalid: passwordValidation.errorMessage });
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
        const control = this.registerForm.get(controlName);
        return !!control && control.touched && control.hasError(errorName);
    }
}