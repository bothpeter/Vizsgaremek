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
        path: 'register',
        loadComponent: () => {
            return import('./register/register.component').then((m) => m.RegisterComponent);
        },
    },
    {
        path: 'user',
        loadComponent: () => {
            return import('./user/user.component').then((m) => m.UserComponent);
        },
        data: { hideFooter: true },
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
    {
        path: 'diets',
        loadComponent: () => {
            return import('./diets/diets.component').then((m) => m.DietsComponent);
        },
    },
    {
        path: 'workouts',
        loadComponent: () => {
            return import('./workouts/workouts.component').then((m) => m.WorkoutsComponent);
        },
    },
    {
        path: 'forgot-password',
        loadComponent: () => {
            return import('./forgot-password/forgot-password.component').then((m) => m.ForgotPasswordComponent);
        },
    },
    {
        path: 'reset-password',
        loadComponent: () => {
            return import('./reset-password/reset-password.component').then((m) => m.ResetPasswordComponent);
        },
    },
    {
        path: 'liked-recipes',
        loadComponent: () => {
            return import('./liked-recipes/liked-recipes.component').then((m) => m.LikedRecipesComponent);
        },
        data: { hideFooter: true },
    },
    {
        path: 'liked-exercises',
        loadComponent: () => {
            return import('./liked-exercises/liked-exercises.component').then((m) => m.LikedExercisesComponent);
        },
        data: { hideFooter: true },
    },
    {
        path: 'settings',
        loadComponent: () => {
            return import('./settings/settings.component').then((m) => m.SettingsComponent);
        },
        data: { hideFooter: true },
    },
    {
        path: 'change-password',
        loadComponent: () => {
            return import('./change-password/change-password.component').then((m) => m.ChangePasswordComponent);
        },
        data: { hideFooter: true },
    },
];
