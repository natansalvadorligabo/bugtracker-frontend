import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TicketCategory } from '../../model/ticket-categories';

@Injectable({
  providedIn: 'root',
})
export class TicketCategoriesService {
  private readonly API_URL = '/bugtracker/categories';

  private httpClient = inject(HttpClient);

  getTicketCategories() {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };

    return this.httpClient.get<TicketCategory[]>(`${this.API_URL}`, {
      headers,
    });
  }

  getTicketCategoryById(categoryId: number) {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };

    return this.httpClient.get<TicketCategory>(
      `${this.API_URL}/${categoryId}`,
      { headers }
    );
  }
}
