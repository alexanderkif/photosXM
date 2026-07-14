import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', 
    loadComponent: () => import('./pages/home/home').then((m) => m.Home), },
  { path: 'photos/:id', 
    loadComponent: () => import('./pages/detailes/detailes').then((m) => m.Detailes), },
  { path: 'favorites', 
    loadComponent: () => import('./pages/favorites/favorites').then((m) => m.Favorites), },
  { path: '**', redirectTo: '' }
];
