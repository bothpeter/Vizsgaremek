import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterLink],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
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

    ngOnInit(): void {
        if (this.authService.isAuthenticated()) {
            this.router.navigateByUrl('/');
        }
    }

    onSubmit(): void {
        if (this.loginForm.invalid) {
            this.markFormGroupTouched(this.loginForm);
            return;
        }

        const credentials = {
            login: this.loginForm.value.login,
            password: this.loginForm.value.password
        };

        this.loading = true;
        this.loginError = '';

        this.authService.attemptLogin(credentials)
            .pipe(finalize(() => this.loading = false))
            .subscribe({
                next: () => { },
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
}