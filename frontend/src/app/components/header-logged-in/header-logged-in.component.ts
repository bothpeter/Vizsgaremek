import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header-logged-in',
  imports: [RouterLink, CommonModule],
  templateUrl: './header-logged-in.component.html',
  styleUrls: ['./header-logged-in.component.css']
})
export class HeaderLoggedInComponent {
  isMenuOpen = false;

  // Toggle the menu
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Close the menu
  closeMenu() {
    this.isMenuOpen = false;
  }

  // Listen for clicks outside the menu
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    // Check if the click is outside the menu and hamburger icon
    if (hamburger && !hamburger.contains(event.target as Node) &&
        navLinks && !navLinks.contains(event.target as Node)) {
      this.closeMenu();
    }
  }
}