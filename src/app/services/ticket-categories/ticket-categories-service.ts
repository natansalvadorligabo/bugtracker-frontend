import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { TicketCategory } from '../../model/ticket-categories';

@Injectable({
  providedIn: 'root',
})
export class TicketCategoriesService {
  private readonly API_URL = '/bugtracker/categories';

  private httpClient = inject(HttpClient);

  getTicketCategories() {
    return this.httpClient.get<TicketCategory[]>(`${this.API_URL}`).pipe(
      catchError(error => {
        console.error('TicketCategoriesService: API call failed', error);
        return throwError(() => error);
      })
    );
  }

  getTicketCategoryById(categoryId: number) {
    return this.httpClient.get<TicketCategory>(`${this.API_URL}/${categoryId}`);
  }

  save(categoryData: { description: string }) {
    return this.httpClient.post<TicketCategory>(`${this.API_URL}`, categoryData);
  }

  update(categoryId: number, categoryData: { description: string }) {
    return this.httpClient.patch<TicketCategory>(`${this.API_URL}/${categoryId}`, categoryData);
  }

  remove(categoryId: number) {
    return this.httpClient.delete<void>(`${this.API_URL}/${categoryId}`);
  }
}
