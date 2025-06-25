import { AsyncPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UsersService } from '../../services/users-service';

@Component({
  selector: 'app-user-profile',
  imports: [AsyncPipe, MatProgressSpinnerModule],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss',
})
export class UserProfile {
  private userService = inject(UsersService);

  user$ = this.userService.getUserProfile();

  pictureUrl = signal<string | null>(null);

  constructor() {
    this.userService.getProfilePicture().subscribe({
      next: (blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          this.pictureUrl.set(url);
        }
      },
      error: () => {
        this.pictureUrl.set(null);
      },
    });
  }
}
