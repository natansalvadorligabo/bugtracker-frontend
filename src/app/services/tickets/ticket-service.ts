import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Ticket } from '../../model/ticket.js';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private readonly API_URL = 'bugtracker/tickets';

  private httpClient = inject(HttpClient);

  save(formData: FormData) {
    return this.httpClient.post(`${this.API_URL}`, formData);
  }

  update(id: number, formData: FormData) {
    return this.httpClient.put(`${this.API_URL}/${id}`, formData);
  }

  getCategories() {
    return this.httpClient.get<any[]>('bugtracker/categories');
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
