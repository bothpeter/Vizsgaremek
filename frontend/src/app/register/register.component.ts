import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { RegisterService } from '../services/register.service';
import { ValidationService } from '../services/validation.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [FormsModule, CommonModule, RouterLink],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
})

export class RegisterComponent {
    emailError: string = '';
    nameError: string = '';
    passwordError: string = '';

    registerObj: Register = {
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    };

    constructor(private router: Router, private registerService: RegisterService, private validationService: ValidationService) { }

    onSubmit(): void {
        this.emailError = '';
        this.nameError = '';
        this.passwordError = '';

        if (!this.validationService.validateEmail(this.registerObj.email)) {
            this.emailError = 'Az e-mail cím érvénytelen formátumú.';
            return;
        }

        const passwordValidation = this.validationService.validatePassword(this.registerObj.password);
        if (!passwordValidation.isValid) {
            this.passwordError = passwordValidation.errorMessage;
            return;
        }

        this.registerService.register(this.registerObj).subscribe({
            next: () => {
                this.router.navigateByUrl('/login');
            },
            error: (error) => {
                if (error.name) {
                    this.nameError = 'Ez a felhasználónév már foglalt.';
                }
                if (error.email) {
                    this.emailError = 'Ez az e-mail cím már foglalt.';
                }
            },
        });
    }

    onPasswordChange(): void {
        if (this.registerObj.password === this.registerObj.password_confirmation) {
            this.passwordError = '';
        }
        const passwordValidation = this.validationService.validatePassword(this.registerObj.password);
        if (!passwordValidation.isValid) {
            this.passwordError = passwordValidation.errorMessage;
        } else {
            this.passwordError = '';
        }
    }
}

export interface Register {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}