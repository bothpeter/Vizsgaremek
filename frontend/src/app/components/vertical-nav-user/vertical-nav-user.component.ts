import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-vertical-nav-user',
  imports: [RouterLink],
  templateUrl: './vertical-nav-user.component.html',
  styleUrl: './vertical-nav-user.component.css'
})
export class VerticalNavUserComponent {
  constructor(private authService: AuthService) {}

  username = localStorage.getItem('userName');

  onLogout() {
    this.authService.logout();
  }

  
}
