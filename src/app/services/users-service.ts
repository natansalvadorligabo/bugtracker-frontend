import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserRegister } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private readonly API_URL = 'bugtracker/auth';

  private httpClient = inject(HttpClient);

  register(user: UserRegister) {
    return this.httpClient.post<UserRegister>(`${this.API_URL}/register`, user);
  }
}
