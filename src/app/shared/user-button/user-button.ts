import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-user-button',
  standalone: true,
  imports: [MatButtonModule, MatMenuModule, MatIconModule, RouterModule],
  template: `
    <button
      matIconButton
      [matMenuTriggerFor]="menu"
      aria-label="Example icon-button with a menu"
    >
      <mat-icon>account_circle</mat-icon>
    </button>
    <mat-menu #menu="matMenu">
      <button mat-menu-item routerLink="user">
        <mat-icon>person</mat-icon>
        <span>Perfil</span>
      </button>
      <button mat-menu-item (click)="handleLogout()">
        <mat-icon>logout</mat-icon>
        <span>Sair</span>
      </button>
    </mat-menu>
  `,
  styles: [],
})
export class UserButtonComponent {
  authService: AuthService = inject(AuthService);

  handleLogout() {
    this.authService.logout();
  }
}
