import { Component, inject, OnInit, signal, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth/auth-service';
import { ProfilePictureService } from '../../services/profile-picture/profile-picture-service';

@Component({
  selector: 'app-user-button',
  standalone: true,
  imports: [MatButtonModule, MatMenuModule, MatIconModule, RouterModule],
  template: `
    <button
      matIconButton
      [matMenuTriggerFor]="menu"
      aria-label="Example icon-button with a menu"
      class="user-profile-button"
    >
      @if (profilePictureUrl()) {
        <img 
          [src]="profilePictureUrl()" 
          alt="Foto de perfil" 
          class="profile-picture"
        />
      } @else {
        <mat-icon>account_circle</mat-icon>
      }
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
  styles: [`
    .user-profile-button {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
    }
    
    .profile-picture {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
    }
  `],
})
export class UserButtonComponent implements OnInit, OnDestroy {
  authService: AuthService = inject(AuthService);
  profilePictureService: ProfilePictureService = inject(ProfilePictureService);
  
  profilePictureUrl = signal<string | null>(null);
  private subscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.loadProfilePicture();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private loadProfilePicture(): void {
    this.profilePictureService.loadProfilePicture();
    
    this.subscription.add(
      this.profilePictureService.profilePicture$.subscribe((url) => {
        this.profilePictureUrl.set(url);
      })
    );
  }

  handleLogout() {
    this.authService.logout();
  }
}
