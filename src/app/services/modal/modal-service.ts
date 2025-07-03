import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ModalNameComponent } from '../../shared/modal-user/modal-name/modal-name';
import { ModalPasswordComponent } from '../../shared/modal-user/modal-password/modal-password';
import { ModalProfilePictureComponent } from '../../shared/modal-user/modal-profile-picture/modal-profile-picture';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private dialog = inject(MatDialog);

  openNameModal(currentName: string): Observable<string | undefined> {
    const dialogRef = this.dialog.open(ModalNameComponent, {
      width: '400px',
      data: {
        title: 'Alterar nome',
        currentValue: currentName,
        placeholder: 'Digite seu nome',
      },
    });

    return dialogRef.afterClosed();
  }

  openPasswordModal(): Observable<
    { oldPassword: string; newPassword: string } | undefined
  > {
    const dialogRef = this.dialog.open(ModalPasswordComponent, {
      width: '400px',
      data: {
        title: 'Alterar senha',
      },
    });

    return dialogRef.afterClosed();
  }

  openProfilePictureModal(
    currentImageUrl?: string | null
  ): Observable<File | undefined> {
    const dialogRef = this.dialog.open(ModalProfilePictureComponent, {
      width: '500px',
      data: {
        title: 'Alterar foto do perfil',
        currentImageUrl: currentImageUrl,
      },
    });

    return dialogRef.afterClosed();
  }
}
