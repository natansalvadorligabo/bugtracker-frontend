import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { ticketResolver } from './services/tickets/ticket-resolver';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./shared/layout/layout').then((m) => m.Layout),
    canActivate: [authGuard],
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
          import('./container/form-ticket/form-ticket').then(
            (m) => m.FormTicket
          ),
      },
      {
        path: 'tickets/edit/:id',
        loadComponent: () =>
          import('./container/form-ticket/form-ticket').then(
            (m) => m.FormTicket
          ),
        resolve: {
          ticket: ticketResolver,
        },
      },
      {
        path: 'tickets/:id',
        loadComponent: () =>
          import('./container/view-ticket/view-ticket').then(
            (m) => m.ViewTicket
          ),
        resolve: {
          ticket: ticketResolver,
        },
      },
      {
        path: 'user',
        loadComponent: () =>
          import('./container/user-profile/user-profile').then(
            (m) => m.UserProfile
          ),
      },
      // {
      //   path: 'users',
      //   loadComponent: () =>
      //     import('./container/form-user/form-user').then(
      //       (m) => m.FormUser
      //     ),
      // },
      {
        path: 'users/new',
        loadComponent: () =>
          import('./container/form-user/form-user').then((m) => m.FormUser),
      },
    ],
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
