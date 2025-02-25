import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { AuthService } from './services/auth.service';
import { HeaderLoggedInComponent } from './components/header-logged-in/header-logged-in.component';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
import { VerticalNavUserComponent } from './components/vertical-nav-user/vertical-nav-user.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, HeaderComponent, HeaderLoggedInComponent, CommonModule, FooterComponent, VerticalNavUserComponent],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
    title = 'frontend';
    hideFooter = false;
    showVerticalNav = false;

    constructor(public authService: AuthService, private router: Router) { }

    ngOnInit(): void {
        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe(() => {
                const currentRoute = this.router.routerState.snapshot.root.firstChild;
                this.hideFooter = currentRoute?.data?.['hideFooter'] || false;
                this.showVerticalNav = currentRoute?.data?.['showVerticalNav'] || false;
            });
    }
}