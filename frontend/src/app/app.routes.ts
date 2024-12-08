import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        loadComponent: () => {
            return import('./home/home.component').then((m) => m.HomeComponent);
        },
    },
    {
        path: 'login',
        loadComponent: () => {
            return import('./login/login.component').then((m) => m.LoginComponent);
        },
    },
    {
        path: 'settings',
        loadComponent: () => {
            return import('./settings/settings.component').then((m) => m.SettingsComponent);
        },
    },
    {
        path: 'contacts',
        loadComponent: () => {
            return import('./contacts/contacts.component').then((m) => m.ContactsComponent);
        },
    },
    {
        path: 'exercises',
        loadComponent: () => {
            return import('./exercises/exercises.component').then((m) => m.ExercisesComponent);
        },
    },
    {
        path: 'recipes',
        loadComponent: () => {
            return import('./recipes/recipes.component').then((m) => m.RecipesComponent);
        },
    },
    {
        path: 'calculator',
        loadComponent: () => {
            return import('./calculator/calculator.component').then((m) => m.CalculatorComponent);
        },
    },
];
