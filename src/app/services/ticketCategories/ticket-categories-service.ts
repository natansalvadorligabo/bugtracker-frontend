import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TicketCategory } from '../../model/ticket-categories';

@Injectable({
  providedIn: 'root',
})
export class TicketCategoriesService {
  private readonly API_URL = '/bugtracker';

  private httpClient = inject(HttpClient);
  
  getTicketCategories() {
    return this.httpClient.get<TicketCategory[]>(`${this.API_URL}/categories`);
  }
}
