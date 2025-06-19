import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'register' },
  {
    path: 'register',
    loadComponent: () =>
      import('./container/register/register').then((m) => m.Register),
  },
  {
    path: 'login',
    loadComponent: () => import('./container/login/login').then((m) => m.Login),
  },
  {
    path: 'tickets',
    loadComponent: () =>
      import('./container/tickets/tickets').then((m) => m.Tickets),
  },
  { path: '**', redirectTo: '' },
];
