import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserProfile as UserProfileModel } from '../../model/user';
import { ModalService } from '../../services/modal/modal-service';
import { ProfilePictureService } from '../../services/profile-picture/profile-picture-service';
import { UsersService } from '../../services/users/users-service';
import { ProfileRowLinkComponent } from '../../shared/profile-row-link/profile-row-link';

@Component({
  selector: 'app-user-profile',
  imports: [
    MatListModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ProfileRowLinkComponent,
    MatCardModule,
    MatDividerModule,
  ],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfile implements OnInit {
  private userService = inject(UsersService);
  private modalService = inject(ModalService);
  private snackBar = inject(MatSnackBar);
  private profilePictureService = inject(ProfilePictureService);

  user = signal<UserProfileModel | null>(null);
  pictureUrl = signal<string | null>(null);
  loading = signal(true);

  ngOnInit() {
    this.loadUserProfile();
    this.loadProfilePicture();
  }

  openNameModal(currentName: string): void {
    this.modalService.openNameModal(currentName).subscribe((newName) => {
      if (newName) {
        this.updateUserName(newName);
      }
    });
  }

  openPasswordModal(): void {
    this.modalService.openPasswordModal().subscribe((passwords) => {
      if (passwords?.oldPassword && passwords?.newPassword) {
        this.updateUserPassword(passwords.oldPassword, passwords.newPassword);
      }
    });
  }

  openProfilePictureModal(): void {
    this.modalService
      .openProfilePictureModal(this.pictureUrl())
      .subscribe((file) => {
        if (file) {
          this.updateProfilePicture(file);
        }
      });
  }

  private loadUserProfile(): void {
    this.userService.getUserProfile().subscribe({
      next: (user) => {
        this.user.set(user);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  private loadProfilePicture(): void {
    this.profilePictureService.profilePicture$.subscribe((url) => {
      this.pictureUrl.set(url);
    });

    this.profilePictureService.loadProfilePicture();
  }

  private updateUserName(newName: string): void {
    this.userService.updateUserProfile({ name: newName }).subscribe({
      next: () => {
        const currentUser = this.user();
        if (currentUser) {
          this.user.set({ ...currentUser, name: newName });
        }
        this.showSuccessMessage('Nome atualizado com sucesso!');
      },
      error: () => {
        this.showErrorMessage('Erro ao atualizar nome, tente novamente.');
      },
    });
  }

  private updateUserPassword(password: string, newPassword: string): void {
    this.userService
      .updateUserProfile({
        password: password,
        newPassword: newPassword,
      })
      .subscribe({
        next: () => {
          this.showSuccessMessage('Senha atualizada com sucesso!');
        },
        error: () => {
          this.showErrorMessage('Erro ao atualizar senha, tente novamente.');
        },
      });
  }

  private updateProfilePicture(file: File): void {
    this.userService.updateUserProfile({ picture: file }).subscribe({
      next: () => {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.pictureUrl.set(e.target?.result as string);
        };
        reader.readAsDataURL(file);
        this.profilePictureService.refreshProfilePicture();
        this.showSuccessMessage('Foto do perfil atualizada com sucesso!');
      },
      error: () => {
        this.showErrorMessage('Erro ao atualizar foto, tente novamente.');
      },
    });
  }

  private showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Fechar', { duration: 3000 });
  }

  private showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      panelClass: 'error-snackbar',
    });
  }
}
