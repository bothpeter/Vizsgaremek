import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { AuthService } from './services/auth.service';
import { HeaderLoggedInComponent } from './components/header-logged-in/header-logged-in.component';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, HeaderLoggedInComponent, CommonModule, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
  constructor(public authService: AuthService) {}
}
