  import { FormTicket } from './containers/form-ticket/form-ticket';
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'ticket', component: FormTicket },
  { path: 'ticket/:id', component: FormTicket },
];
