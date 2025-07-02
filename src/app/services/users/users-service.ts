import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  UserLogin,
  UserProfile,
  UserRegister,
  UserUpdate,
} from '../../model/user';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly API_URL = '/bugtracker';

  private httpClient = inject(HttpClient);

  register(user: UserRegister) {
    const formData = new FormData();
    formData.append('name', user.name);
    formData.append('email', user.email);
    formData.append('password', user.password);

    return this.httpClient.post<UserRegister>(
      `${this.API_URL}/auth/register`,
      formData
    );
  }

  login(user: UserLogin) {
    return this.httpClient.post<UserLogin>(`${this.API_URL}/auth/login`, user);
  }

  getUserProfile() {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };

    return this.httpClient.get<UserProfile>(`${this.API_URL}/users`, {
      headers,
    });
  }

  getProfilePicture() {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };

    return this.httpClient.get(`${this.API_URL}/users/picture`, {
      headers,
      responseType: 'blob',
    });
  }

  updateUserProfile(data: UserUpdate) {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };

    const formData = new FormData();
    if (data.name) {
      formData.append('name', data.name);
    }
    if (data.password) {
      formData.append('password', data.password);
    }
    if (data.newPassword) {
      formData.append('newPassword', data.newPassword);
    }
    if (data.picture) {
      formData.append('picture', data.picture);
    }

    return this.httpClient.put<UserUpdate>(`${this.API_URL}/users`, formData, {
      headers: headers,
    });
  }
}
