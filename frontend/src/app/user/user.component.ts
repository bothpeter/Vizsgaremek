// user.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service'; // Import the AuthService

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent {
  constructor(private authService: AuthService) {} // Inject the AuthService

  onLogout() {
    this.authService.logout(); // Call the logout method
  }
}