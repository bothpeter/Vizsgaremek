import { Component, HostListener } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-vertical-nav-user',
    imports: [CommonModule, RouterModule],
    templateUrl: './vertical-nav-user.component.html',
    styleUrl: './vertical-nav-user.component.css',
    standalone: true
})
export class VerticalNavUserComponent {
    constructor(private authService: AuthService) { }

    username = localStorage.getItem('userName');
    isMenuOpen = false;

    onLogout() {
        this.authService.logout();
    }

    toggleMenu(event?: Event) {
        if (event) {
            event.stopPropagation();
        }
        this.isMenuOpen = !this.isMenuOpen;
    }

    closeMenu() {
        if (window.innerWidth <= 768) {
            this.isMenuOpen = false;
        }
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
        if (this.isMenuOpen && window.innerWidth <= 768) {
            const navElement = document.querySelector('.vertical-nav-container');
            const toggleBtn = document.querySelector('.toggle-btn');

            if (navElement && toggleBtn) {
                const clickedInside = navElement.contains(event.target as Node) ||
                    toggleBtn.contains(event.target as Node);

                if (!clickedInside) {
                    this.isMenuOpen = false;
                }
            }
        }
    }
}