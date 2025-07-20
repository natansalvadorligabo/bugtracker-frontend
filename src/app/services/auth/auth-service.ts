import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { ProfilePictureService } from '../profile-picture/profile-picture-service';

interface JwtPayload {
  token: string,
  username: string,
  roles: string[]
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private profilePictureService = inject(ProfilePictureService);

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
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

  getUserFromToken(): any {
    const decoded = this.decodeToken();
    if (!decoded) {
      return null;
    }

    return {
      email: decoded.sub,
      userId: decoded.userId,
      roles: decoded.roles || []
    };
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
}
