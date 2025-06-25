import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
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
}
