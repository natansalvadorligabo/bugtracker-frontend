import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  UserLogin,
  UserProfile,
  UserRegister,
  UserUpdate,
  VerifyCodeResponse,
} from '../../model/user';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly API_URL = '/bugtracker';

  private httpClient = inject(HttpClient);

  register(formData: FormData) {
    return this.httpClient.post(
      `${this.API_URL}/auth/register`,
      formData,
      { responseType: 'text' }
    );
  }

  login(user: UserLogin) {
    return this.httpClient.post<UserLogin>(`${this.API_URL}/auth/login`, user);
  }

  getUserById(userId: number) {
    return this.httpClient.get<UserProfile>(`${this.API_URL}/users/${userId}`);
  }

  getUserProfile() {
    return this.httpClient.get<UserProfile>(`${this.API_URL}/users`);
  }

  getProfilePicture() {
    return this.httpClient.get(`${this.API_URL}/users/picture`, {
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

    return this.httpClient.put<UserUpdate>(`${this.API_URL}/users`, formData);
  }

  recoveryPassword(email: string) {
    return this.httpClient.post<string>(
      `${this.API_URL}/auth/forgot-password`,
      { email },
      { responseType: 'text' as 'json' }
    );
  }

  verifyRecoveryCode(email: string, code: string) {
    return this.httpClient.post<VerifyCodeResponse>(
      `${this.API_URL}/auth/verify-code`,
      {
        email: email,
        code: code,
      }
    );
  }

  resetPassword(email: string, password: string, code: string) {
    return this.httpClient.post(
      `${this.API_URL}/auth/reset-password`,
      {
        email: email,
        newPassword: password,
        token: code,
      },
      { responseType: 'text' as 'json' }
    );
  }
}
