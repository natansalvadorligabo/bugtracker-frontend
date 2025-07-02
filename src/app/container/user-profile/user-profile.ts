import { AsyncPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalService } from '../../services/modal/modal-service';
import { UsersService } from '../../services/users/users-service';
import { ProfileRowLinkComponent } from '../../shared/profile-row-link/profile-row-link';

@Component({
  selector: 'app-user-profile',
  imports: [
    AsyncPipe,
    MatListModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ProfileRowLinkComponent,
    MatCardModule,
    MatDividerModule,
  ],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss',
})
export class UserProfile {
  private userService = inject(UsersService);
  private modalService = inject(ModalService);
  private snackBar = inject(MatSnackBar);

  user$ = this.userService.getUserProfile();
  pictureUrl = signal<string | null>(null);

  ngOnInit() {
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

  private loadProfilePicture(): void {
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

  private updateUserName(newName: string): void {
    // TODO: Implementar chamada para atualizar nome
    console.log('Updating name:', newName);
    this.showSuccessMessage('Nome atualizado com sucesso!');
    this.refreshUserData();
  }

  private updateUserPassword(oldPassword: string, newPassword: string): void {
    // TODO: Implementar chamada para atualizar senha
    console.log('Updating password:', { oldPassword, newPassword });
    this.showSuccessMessage('Senha atualizada com sucesso!');
  }

  private updateProfilePicture(file: File): void {
    // TODO: Implementar upload da foto
    const reader = new FileReader();
    reader.onload = (e) => {
      this.pictureUrl.set(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    this.showSuccessMessage('Foto do perfil atualizada com sucesso!');
  }

  private showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Fechar', { duration: 3000 });
  }

  private refreshUserData(): void {
    this.user$ = this.userService.getUserProfile();
  }
}
