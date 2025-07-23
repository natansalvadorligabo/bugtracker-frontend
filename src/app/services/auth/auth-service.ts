import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Role } from '../../model/role';
import { User, UserLogin, VerifyCodeResponse } from '../../model/user';
import { ProfilePictureService } from '../profile-picture/profile-picture-service';

interface JwtPayload {
  token: string;
  username: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);
  private profilePictureService = inject(ProfilePictureService);

  private readonly API_URL = '/bugtracker/auth';
  private httpClient = inject(HttpClient);

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    sessionStorage.clear();
    this.profilePictureService.clearProfilePicture();
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }

    try {
      const decoded = this.decodeToken(token);
      if (!decoded) {
        return false;
      }
      return !this.isTokenExpired(decoded);
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return false;
    }
  }

  decodeToken(token?: string): any | null {
    const tokenToUse = token || this.getToken();
    if (!tokenToUse) {
      return null;
    }

    try {
      return jwtDecode<any>(tokenToUse);
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return null;
    }
  }

  isTokenExpired(decodedToken?: any): boolean {
    const decoded = decodedToken || this.decodeToken();
    if (!decoded || !decoded.exp) {
      return true;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  }

  getUserFromToken(): User | any {
    const decoded = this.decodeToken();
    if (!decoded) {
      return null;
    }

    return {
      email: decoded.sub,
      userId: decoded.id,
      name: decoded.name,
      roles: decoded.roles || [],
    } as User;
  }

  hasRole(role: string): boolean {
    const user = this.getUserFromToken();
    return user?.roles?.includes(role) || false;
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.getUserFromToken();
    if (!user?.roles) {
      return false;
    }
    return roles.some(role => user.roles.includes(role));
  }

  get isUser(): boolean {
    return this.hasRole('ROLE_USER');
  }

  get isTechnician(): boolean {
    return this.hasRole('ROLE_TECHNICIAN') || this.hasRole('ROLE_ADMIN');
  }

  get isAdmin(): boolean {
    return this.hasRole('ROLE_ADMIN');
  }

  getRoles() {
    return this.httpClient.get<Role[]>(`${this.API_URL}/roles`);
  }

  register(formData: FormData) {
    return this.httpClient.post(`${this.API_URL}/register`, formData, { responseType: 'text' });
  }

  login(user: UserLogin) {
    return this.httpClient.post<UserLogin>(`${this.API_URL}/login`, user);
  }

  recoveryPassword(email: string) {
    return this.httpClient.post<string>(`${this.API_URL}/forgot-password`, { email }, { responseType: 'text' as 'json' });
  }

  verifyRecoveryCode(email: string, code: string) {
    return this.httpClient.post<VerifyCodeResponse>(`${this.API_URL}/verify-code`, {
      email: email,
      code: code,
    });
  }

  resetPassword(email: string, password: string, code: string) {
    return this.httpClient.post(
      `${this.API_URL}/reset-password`,
      {
        email: email,
        newPassword: password,
        token: code,
      },
      { responseType: 'text' as 'json' }
    );
  }
}
