import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css'
})
export class ContactsComponent {
  name: string = '';
  email: string = '';
  message: string = '';
  emailError: string = '';

  onSubmit() {
    this.emailError = '';

    if (!this.validateEmail(this.email)) {
      this.emailError = 'Az e-mail cím érvénytelen formátumú.';
      return;
    }

    console.log('Név:', this.name);
    console.log('E-mail:', this.email);
    console.log('Üzenet:', this.message);

  }

  validateEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }
}
