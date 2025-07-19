import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  Ticket
} from '../../model/ticket';

@Injectable({
  providedIn: 'root',
})
export class TicketsService {
  private readonly API_URL = '/bugtracker';

  private httpClient = inject(HttpClient);

  getTickets() {
    return this.httpClient.get<Ticket[]>(`${this.API_URL}/tickets`);
  }
}
