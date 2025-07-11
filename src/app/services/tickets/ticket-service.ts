import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Ticket } from '../../model/ticket.js';
import { AuthService } from '../auth-service.js';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private readonly API_URL = 'bugtracker/tickets';

  private httpClient = inject(HttpClient);
  private authService = inject(AuthService);

  save(formData: FormData) {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.httpClient.post(`${this.API_URL}`, formData, { headers });
  }

  update(id: number, formData: FormData) {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.httpClient.put(`${this.API_URL}/${id}`, formData, { headers });
  }

  getCategories() {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.httpClient.get<any[]>('bugtracker/categories', { headers });
  }

  getTicketById(ticketId: number) {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.httpClient.get<any>(`${this.API_URL}/${ticketId}`, { headers });
  }

  getTicketImage(filename: string): Observable<Blob> {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };

    return this.httpClient.get(`/bugtracker/tickets/image/${filename}`, {
      headers,
      responseType: 'blob'
    });
  }
}
