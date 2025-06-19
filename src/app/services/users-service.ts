import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserRegister } from '../model/user';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly API_URL = 'bugtracker/auth';

  private httpClient = inject(HttpClient);

  register(user: UserRegister) {
    const formData = new FormData();
    formData.append('name', user.name);
    formData.append('email', user.email);
    formData.append('password', user.password);

    return this.httpClient.post<UserRegister>(
      `${this.API_URL}/register`,
      formData
    );
  }
}
