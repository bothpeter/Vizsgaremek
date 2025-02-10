import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header-logged-in',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header-logged-in.component.html',
  styleUrl: './header-logged-in.component.css'
})
export class HeaderLoggedInComponent {

}
