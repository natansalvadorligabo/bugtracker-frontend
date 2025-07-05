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

  save(formData: FormData) {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.httpClient.post(`${this.API_URL}`, formData, { headers });
  }

}
