import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { VerticalNavUserComponent } from '../components/vertical-nav-user/vertical-nav-user.component';

@Component({
  selector: 'app-user',
  imports: [CommonModule, VerticalNavUserComponent],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  userName: string = '';
  userEmail: string = '';
  userPhysique: any = null;
  errorMessage: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.userName = localStorage.getItem('userName') || '';
    this.userEmail = localStorage.getItem('userEmail') || '';

    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
      this.errorMessage = 'Nincs érvényes hitelesítési token.';
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`
    });

    this.http.get('http://127.0.0.1:8000/api/user_physique', { headers }).subscribe(
      (response: any) => {
        if (response.status === 200 && response.UserPhysique.length > 0) {
          this.userPhysique = response.UserPhysique[0];
        } else {
          this.errorMessage = 'Nincs elérhető adat a felhasználó fizikumáról. A beállításokban tudod beállítani a fizikumodat.';
        }
      },
      (error) => {
        this.errorMessage = 'Hiba történt az adatok lekérése során.';
      }
    );
  }
}
