import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-user',
    imports: [CommonModule],
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css']
})

export class UserComponent implements OnInit {
    userName: string = '';
    userEmail: string = '';
    userPhysique: any = null;
    errorMessage: string = '';

    constructor(private apiService: ApiService, private authService: AuthService) { }

    ngOnInit(): void {
        this.userName = localStorage.getItem('userName') || '';
        this.userEmail = localStorage.getItem('userEmail') || '';

        if (!this.authService.isAuthenticated()) {
            this.errorMessage = 'Jelentkezz be, a profilod megtekintéséhez!';
            return;
        }

        this.apiService.get('user_physique').subscribe({
            next: (res: any) => {
                if (res.status === 200 && res.UserPhysique.length > 0) {
                    this.userPhysique = res.UserPhysique[0];
                } else {
                    this.errorMessage = 'Nincs elérhető adat a felhasználó fizikumáról. A beállításokban tudod beállítani a fizikumodat.';
                }
            },
            error: () => {
                this.errorMessage = 'Hiba történt az adatok lekérése során.';
            }
        });
    }
}
