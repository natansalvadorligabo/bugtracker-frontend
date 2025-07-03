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

export interface ModalNameData {
  title: string;
  currentValue: string;
  placeholder?: string;
}

@Component({
  selector: 'app-modal-name',
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
        <mat-form-field class="w-full">
          <mat-label>{{ data.placeholder || data.title }}</mat-label>
          <input
            matInput
            type="text"
            [(ngModel)]="newValue"
            [placeholder]="data.placeholder || ''"
          />
          <mat-icon matSuffix>person</mat-icon>
        </mat-form-field>
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
export class ModalNameComponent {
  newValue: string = '';

  constructor(
    public dialogRef: MatDialogRef<ModalNameComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalNameData
  ) {
    this.newValue = data.currentValue;
  }

  isValid(): boolean {
    return this.newValue.trim().length > 0;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.newValue);
  }
}
