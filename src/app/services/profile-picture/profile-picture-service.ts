import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UsersService } from '../users/users-service';

@Injectable({
  providedIn: 'root',
})
export class ProfilePictureService {
  private usersService = inject(UsersService);
  private profilePictureSubject = new BehaviorSubject<string | null>(null);

  get profilePicture$(): Observable<string | null> {
    return this.profilePictureSubject.asObservable();
  }

  loadProfilePicture(): void {
    this.usersService.getProfilePicture().subscribe({
      next: (blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          this.profilePictureSubject.next(url);
        } else {
          this.profilePictureSubject.next(null);
        }
      },
      error: () => {
        this.profilePictureSubject.next(null);
      },
    });
  }

  refreshProfilePicture(): void {
    const currentUrl = this.profilePictureSubject.value;
    if (currentUrl) {
      URL.revokeObjectURL(currentUrl);
    }
    this.loadProfilePicture();
  }

  clearProfilePicture(): void {
    const currentUrl = this.profilePictureSubject.value;
    if (currentUrl) {
      URL.revokeObjectURL(currentUrl);
    }
    this.profilePictureSubject.next(null);
  }
}
