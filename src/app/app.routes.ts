import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'register' },
  {
    path: 'register',
    loadComponent: () => import('./container/register/register')
      .then(m => m.Register)
  },
  {
    path: 'tickets',
    loadComponent: () => import('./container/tickets/tickets')
      .then(m => m.Tickets)
  },
  { path: '**', redirectTo: '' }
];
