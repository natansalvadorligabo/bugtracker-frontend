import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

export interface ModalPasswordData {
  title: string;
}

@Component({
  selector: 'app-modal-password',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatIconModule,
  ],
  template: `
    <div class="p-6">
      <h2 mat-dialog-title class="text-xl font-semibold mb-4">
        {{ data.title }}
      </h2>

      <mat-dialog-content>
        <div class="flex flex-col gap-4">
          <mat-form-field class="w-full">
            <mat-label>Senha atual</mat-label>
            <input
              matInput
              type="password"
              [(ngModel)]="password"
              placeholder="Digite sua senha atual"
            />
            <mat-icon matSuffix>lock</mat-icon>
          </mat-form-field>

          <mat-form-field class="w-full">
            <mat-label>Nova senha</mat-label>
            <input
              matInput
              type="password"
              [(ngModel)]="newPassword"
              placeholder="Digite sua nova senha"
            />
            <mat-icon matSuffix>lock</mat-icon>
          </mat-form-field>

          <mat-form-field class="w-full">
            <mat-label>Confirmar nova senha</mat-label>
            <input
              matInput
              type="password"
              [(ngModel)]="confirmPassword"
              placeholder="Confirme sua nova senha"
            />
            <mat-icon matSuffix>lock</mat-icon>
          </mat-form-field>

          @if (newPassword && confirmPassword && newPassword !==
          confirmPassword) {
          <div class="text-red-500 text-sm mt-1">
            <mat-icon class="text-red-500 text-sm mr-1">error</mat-icon>
            As senhas não conferem
          </div>
          } @if (newPassword && newPassword.length > 0 && newPassword.length <
          6) {
          <div class="text-orange-500 text-sm mt-1">
            <mat-icon class="text-orange-500 text-sm mr-1">warning</mat-icon>
            A senha deve ter pelo menos 6 caracteres
          </div>
          }
        </div>
      </mat-dialog-content>

      <mat-dialog-actions class="flex justify-end gap-2 mt-4">
        <button mat-button (click)="onCancel()">Cancelar</button>
        <button
          mat-raised-button
          color="primary"
          (click)="onSave()"
          [disabled]="!isValid()"
        >
          Salvar
        </button>
      </mat-dialog-actions>
    </div>
  `,
})
export class ModalPasswordComponent {
  password: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor(
    public dialogRef: MatDialogRef<ModalPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalPasswordData
  ) {}

  isValid(): boolean {
    return (
      this.password.trim().length > 0 &&
      this.newPassword.trim().length >= 6 &&
      this.confirmPassword.trim().length > 0 &&
      this.newPassword === this.confirmPassword
    );
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close({
      oldPassword: this.password,
      newPassword: this.newPassword,
    });
  }
}
