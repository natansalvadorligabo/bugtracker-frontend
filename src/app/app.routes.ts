import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';
import { authGuard } from './guards/auth.guard';
import { ticketResolver } from './services/tickets/ticket-resolver';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./shared/layout/layout').then(m => m.Layout),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'tickets', pathMatch: 'full' },
      {
        path: 'tickets',
        loadComponent: () => import('./container/list-tickets/list-tickets').then(m => m.ListTickets),
      },
      {
        path: 'tickets/new',
        loadComponent: () => import('./container/form-ticket/form-ticket').then(m => m.FormTicket),
      },
      {
        path: 'tickets/edit/:id',
        loadComponent: () => import('./container/form-ticket/form-ticket').then(m => m.FormTicket),
        resolve: {
          ticket: ticketResolver,
        },
      },
      {
        path: 'tickets/:id',
        loadComponent: () => import('./container/view-ticket/view-ticket').then(m => m.ViewTicket),
        resolve: {
          ticket: ticketResolver,
        },
      },
      {
        path: 'user',
        loadComponent: () => import('./container/user-profile/user-profile').then(m => m.UserProfile),
      },
      {
        path: 'users',
        loadComponent: () => import('./container/list-users/list-users').then(m => m.ListUsers),
        canActivate: [adminGuard],
      },
      {
        path: 'users/new',
        loadComponent: () => import('./container/form-user/form-user').then(m => m.FormUser),
        canActivate: [adminGuard],
      },
      {
        path: 'users/edit/:id',
        loadComponent: () => import('./container/form-user/form-user').then(m => m.FormUser),
        canActivate: [adminGuard],
      },
      {
        path: 'categories',
        loadComponent: () => import('./container/list-categories/list-categories').then(m => m.ListCategories),
        canActivate: [adminGuard],
      },
      {
        path: 'categories/new',
        loadComponent: () => import('./container/form-category/form-category').then(m => m.FormCategory),
        canActivate: [adminGuard],
      },
      {
        path: 'categories/edit/:id',
        loadComponent: () => import('./container/form-category/form-category').then(m => m.FormCategory),
        canActivate: [adminGuard],
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () => import('./container/login/login').then(m => m.Login),
  },
  {
    path: 'account-recovery',
    loadComponent: () => import('./container/password-recovery/password-recovery').then(m => m.PasswordRecovery),
  },
  { path: '**', redirectTo: '' },
];
