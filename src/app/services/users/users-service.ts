import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  User,
  UserPage,
  UserProfile,
  UserUpdate,
} from '../../model/user';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly API_URL = '/bugtracker/users';

  private httpClient = inject(HttpClient);

  getUsers(page = 0, pageSize = 10) {
    return this.httpClient.get<UserPage>(this.API_URL, {
      params: {
        page: page,
        pageSize: pageSize,
      },
    });
  }

  getTechnicians() {
    return this.httpClient.get<User[]>(`${this.API_URL}/roles/technician`);
  }

  remove(id: number) {
    return this.httpClient.delete(`${this.API_URL}/${id}`);
  }

  getUserById(userId: number) {
    return this.httpClient.get<UserProfile>(`${this.API_URL}/${userId}`);
  }

  getUserProfile() {
    return this.httpClient.get<UserProfile>(`${this.API_URL}/me`);
  }

  getProfilePicture() {
    return this.httpClient.get(`${this.API_URL}/picture`, {
      responseType: 'blob',
    });
  }

  updateUserProfile(data: UserUpdate) {
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
      formData.append('profilePicture', data.picture);
    }

    return this.httpClient.put<UserUpdate>(`${this.API_URL}`, formData);
  }
}
