import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})

export class ValidationService {
    validateEmail(email: string): boolean {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    }

    validatePassword(password: string): { isValid: boolean; errorMessage: string } {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (password.length < minLength) {
            return { isValid: false, errorMessage: 'A jelszónak legalább 8 karakter hosszúnak kell lennie.' };
        }
        if (!hasUpperCase) {
            return { isValid: false, errorMessage: 'A jelszónak tartalmaznia kell legalább egy nagybetűt.' };
        }
        if (!hasNumber) {
            return { isValid: false, errorMessage: 'A jelszónak tartalmaznia kell legalább egy számot.' };
        }
        if (!hasSpecialChar) {
            return { isValid: false, errorMessage: 'A jelszónak tartalmaznia kell legalább egy speciális karaktert.' };
        }

        return { isValid: true, errorMessage: '' };
    }
}