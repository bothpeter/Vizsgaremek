import { Component, HostListener, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-header-logged-in',
    standalone: true,
    imports: [RouterLink, RouterModule, CommonModule],
    templateUrl: './header-logged-in.component.html',
    styleUrls: ['./header-logged-in.component.css']
})
export class HeaderLoggedInComponent implements OnInit {
    isMenuOpen = false;
    profilePicture: string | null = null;

    constructor(private apiService: ApiService, private authService: AuthService) { }

    ngOnInit(): void {
        this.fetchProfilePicture();
    }

    fetchProfilePicture() {
        this.apiService.get('user_physique').subscribe({
            next: (response: any) => {
                if (response.status === 200 && response.UserPhysique.length > 0) {
                    this.profilePicture = response.UserPhysique[0].progress_picture;
                }
            },
            error: (res: any) => {
                console.error('Error fetching profile picture:');
                if (res.status === 401) {
                    this.authService.logoutWithExpiredToken();
                }
            }
        });
    }

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
    }

    closeMenu() {
        this.isMenuOpen = false;
    }

    @HostListener('document:click', ['$event'])
    onClick(event: MouseEvent) {
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');

        if (hamburger && !hamburger.contains(event.target as Node) &&
            navLinks && !navLinks.contains(event.target as Node)) {
            this.closeMenu();
        }
    }
}