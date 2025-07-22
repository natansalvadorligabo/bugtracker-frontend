import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message, MessageCreate } from '../../model/message';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private readonly API_URL = '/bugtracker/messages';

  private httpClient = inject(HttpClient);

  loadById(ticketId: number): Observable<Message[]> {
    return this.httpClient.get<Message[]>(`${this.API_URL}/tickets/${ticketId}`);
  }

  save(message: MessageCreate): Observable<Message> {
    return this.httpClient.post<Message>(`${this.API_URL}/tickets/${message.ticketId}`, message);
  }

  update(messageId: number, message: string): Observable<Message> {
    return this.httpClient.patch<Message>(`${this.API_URL}/${messageId}`, message);
  }
}
