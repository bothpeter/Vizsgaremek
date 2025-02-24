import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VerticalNavUserComponent } from '../components/vertical-nav-user/vertical-nav-user.component';
import { ValidationService } from '../services/validation.service';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-change-password',
    standalone: true,
    imports: [FormsModule, CommonModule, VerticalNavUserComponent],
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
    password: string = '';
    password_confirmation: string = '';
    passwordError: string = '';

    constructor(private router: Router, private validationService: ValidationService, private apiService: ApiService, private authService: AuthService) { }

    onSubmit() {
        this.passwordError = '';

        if (this.password !== this.password_confirmation) {
            this.passwordError = 'A jelszavak nem egyeznek.';
            return;
        }

        const passwordValidation = this.validationService.validatePassword(this.password);
        if (!passwordValidation.isValid) {
            this.passwordError = passwordValidation.errorMessage;
            return;
        }

        if (!this.authService.isAuthenticated()) {
            alert('Kérjük, jelentkezzen be!');
            return;
        }

        const payload = {
            password: this.password,
            password_confirmation: this.password_confirmation
        };

        this.apiService.put('user', payload).subscribe({
            next: () => {
                alert('A jelszó sikeresen módosítva!');
                this.router.navigateByUrl('/user');
            },
            error: (error) => {this.passwordError = 'Hiba történt a jelszó módosítása során. Kérjük, próbáld újra később.', error;}
        });
    }

    onPasswordChange() {
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