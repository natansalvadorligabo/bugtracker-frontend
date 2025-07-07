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
      {
        path: 'tickets/new',
        loadComponent: () =>
          import('./container/form-ticket/form-ticket').then((m) => m.FormTicket),
      },
      {
        path: 'tickets/edit/:id',
        loadComponent: () =>
          import('./container/form-ticket/form-ticket').then(m => m.FormTicket)
      },
      {
        path: 'user',
        loadComponent: () =>
          import('./container/user-profile/user-profile').then(
            (m) => m.UserProfile
          ),
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
  {
    path: 'account-recovery',
    loadComponent: () =>
      import('./container/password-recovery/password-recovery').then(
        (m) => m.PasswordRecovery
      ),
  },
  { path: '**', redirectTo: '' },
];
