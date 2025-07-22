import { Injectable, inject } from '@angular/core';
import { AuthService } from '../auth/auth-service';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private authService = inject(AuthService);

  private cachedRoles: string[] | null = null;

  private getUserRoles(): string[] {
    if (this.cachedRoles !== null) {
      return this.cachedRoles;
    }
    const token = this.authService.getToken() ?? undefined;
    if (!token) {
      this.cachedRoles = [];
      return this.cachedRoles;
    }
    this.cachedRoles = this.authService.decodeToken(token).roles || [];
    return this.cachedRoles;
  }

  get isUser(): boolean {
    return this.getUserRoles().includes('ROLE_USER');
  }

  get isTechnician(): boolean {
    return this.getUserRoles().includes('ROLE_TECHNICIAN');
  }

  get isAdmin(): boolean {
    return this.getUserRoles().includes('ROLE_ADMIN');
  }

  hasRole(role: string): boolean {
    return this.getUserRoles().includes(role);
  }

  hasAnyRole(roles: string[]): boolean {
    const userRoles = this.getUserRoles();
    return roles.some(role => userRoles.includes(role));
  }

  hasAllRoles(roles: string[]): boolean {
    const userRoles = this.getUserRoles();
    return roles.every(role => userRoles.includes(role));
  }
}
