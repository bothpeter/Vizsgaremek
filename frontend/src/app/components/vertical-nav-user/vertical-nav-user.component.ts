import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-vertical-nav-user',
    imports: [CommonModule, RouterModule],
    templateUrl: './vertical-nav-user.component.html',
    styleUrl: './vertical-nav-user.component.css',
    standalone: true
})
export class VerticalNavUserComponent implements OnInit {
    userName: string = '';

    constructor(
        private authService: AuthService,
    ) { }

    ngOnInit(): void {
        const userData = this.authService.getUserData();
        if (userData) {
            this.userName = userData.name || '';
        }
    }

    isMenuOpen = false;

    onLogout() {
        this.authService.logout().subscribe({
            next: () => { },
            error: (error) => { console.error('Logout error:', error); }
        });
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