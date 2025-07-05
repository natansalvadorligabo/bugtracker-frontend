import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TicketSave } from '../model/ticket.js';
import { AuthService } from './auth-service.js';


@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private readonly API_URL = 'bugtracker/tickets';

  private httpClient = inject(HttpClient);
  private authService = inject(AuthService);

  save(ticket: TicketSave) {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${token}`
    );

    return this.httpClient.post<TicketSave>(
      `${this.API_URL}`,
      ticket,
      { headers }
    );
  }
}
