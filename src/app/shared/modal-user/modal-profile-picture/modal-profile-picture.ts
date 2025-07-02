import { Component, Inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

export interface ModalProfilePictureData {
  title: string;
  currentImageUrl?: string | null;
}

@Component({
  selector: 'app-modal-profile-picture',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="p-6">
      <h2 mat-dialog-title class="text-xl font-semibold mb-4">
        {{ data.title }}
      </h2>

      <mat-dialog-content>
        <div class="flex flex-col gap-4 min-h-50">
          <div class="flex justify-center">
            @if (previewUrl()) {
            <img
              [src]="previewUrl()"
              alt="Preview"
              class="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
            />
            } @else {
            <div
              class="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300"
            >
              <mat-icon class="text-gray-400 text-4xl">person</mat-icon>
            </div>
            }
          </div>

          <input
            type="file"
            accept="image/*"
            (change)="onFileSelected($event)"
            #fileInput
            class="hidden"
          />

          <button
            mat-raised-button
            color="primary"
            (click)="fileInput.click()"
            class="w-full"
          >
            <mat-icon class="mr-2">photo_camera</mat-icon>
            Escolher nova foto
          </button>

          @if (selectedFile) {
          <div class="text-center text-sm text-gray-600">
            <mat-icon class="text-green-500 text-sm mr-1"
              >check_circle</mat-icon
            >
            Arquivo selecionado: {{ selectedFile.name }}
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
export class ModalProfilePictureComponent {
  selectedFile: File | null = null;
  previewUrl = signal<string | null>(null);

  constructor(
    public dialogRef: MatDialogRef<ModalProfilePictureComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalProfilePictureData
  ) {
    if (data.currentImageUrl) {
      this.previewUrl.set(data.currentImageUrl);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl.set(e.target?.result as string);
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  isValid(): boolean {
    return this.selectedFile !== null;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.selectedFile);
  }
}
