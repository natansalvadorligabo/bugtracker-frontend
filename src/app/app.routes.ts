import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./shared/layout/layout').then((m) => m.Layout),
    children: [
      { path: '', redirectTo: 'tickets', pathMatch: 'full' },
      {
        path: 'tickets',
        loadComponent: () =>
          import('./container/tickets/tickets').then((m) => m.Tickets),
      },
    ],
  },

  {
    path: 'register',
    loadComponent: () =>
      import('./container/register/register').then((m) => m.Register),
  },
  {
    path: 'login',
    loadComponent: () => import('./container/login/login').then((m) => m.Login),
  },

  { path: '**', redirectTo: '' },
];
