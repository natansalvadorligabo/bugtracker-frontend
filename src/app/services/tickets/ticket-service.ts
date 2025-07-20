import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ticket } from '../../model/ticket.js';


@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private readonly API_URL = '/bugtracker/tickets';

  private httpClient = inject(HttpClient);

  getTickets() {
    return this.httpClient.get<Ticket[]>(`${this.API_URL}`);
  }

  save(formData: FormData) {
    return this.httpClient.post(`${this.API_URL}`, formData);
  }

  update(id: number, formData: FormData) {
    return this.httpClient.put(`${this.API_URL}/${id}`, formData);
  }

  getTicketById(ticketId: number) {
    return this.httpClient.get<any>(`${this.API_URL}/${ticketId}`);
  }

  getTicketImage(filename: string): Observable<Blob> {
    return this.httpClient.get(`/bugtracker/tickets/image/${filename}`, {
      responseType: 'blob'
    });
  }
}
