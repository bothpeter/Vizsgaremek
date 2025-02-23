import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-header-logged-in',
  imports: [RouterLink, CommonModule],
  templateUrl: './header-logged-in.component.html',
  styleUrls: ['./header-logged-in.component.css']
})
export class HeaderLoggedInComponent implements OnInit {
  isMenuOpen = false;
  profilePicture: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchProfilePicture();
  }

  fetchProfilePicture() {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      console.error('No auth token found');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`
    });

    this.http.get('http://127.0.0.1:8000/api/user_physique', { headers }).subscribe(
      (response: any) => {
        if (response.status === 200 && response.UserPhysique.length > 0) {
          this.profilePicture = response.UserPhysique[0].progress_picture;
        }
      },
      (error) => {
        console.error('Error fetching profile picture:', error);
      }
    );
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