import { Component, Inject, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FormUtilsService } from '../../form/form-utils';

export interface ModalProfilePictureData {
  title: string;
  currentImageUrl?: string | null;
}

@Component({
  selector: 'app-modal-profile-picture',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  template: `
    <div class="p-6">
      <h2 mat-dialog-title class="text-xl font-semibold mb-4">
        {{ data.title }}
      </h2>

      <mat-dialog-content>
        <form [formGroup]="form" class="space-y-1 pt-4">
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
              type="button"
              mat-raised-button
              color="primary"
              (click)="fileInput.click()"
              class="w-full bg-blue-500 text-white hover:bg-blue-600"
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
        </form>
      </mat-dialog-content>

      <mat-dialog-actions class="flex justify-end gap-2 mt-4">
        <button
          mat-button
          (click)="onCancel()"
          class="text-blue-500 hover:text-blue-700"
        >
          Cancelar
        </button>
        <button
          mat-raised-button
          color="primary"
          (click)="onSave()"
          [disabled]="form.invalid || !selectedFile"
          class="bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Salvar
        </button>
      </mat-dialog-actions>
    </div>
  `,
})
export class ModalProfilePictureComponent {
  form: FormGroup;
  formUtils = inject(FormUtilsService);
  selectedFile: File | null = null;
  previewUrl = signal<string | null>(null);

  constructor(
    public dialogRef: MatDialogRef<ModalProfilePictureComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalProfilePictureData,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      profilePicture: [null, [this.validateFile.bind(this)]],
    });

    if (data.currentImageUrl) {
      this.previewUrl.set(data.currentImageUrl);
    }
  }

  validateFile(control: any): { [key: string]: any } | null {
    const file = this.selectedFile;
    if (!file) {
      return { required: true };
    }

    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];
    if (!allowedTypes.includes(file.type)) {
      return { invalidFileType: true };
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return { fileTooLarge: true };
    }

    return null;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      this.form.get('profilePicture')?.setValue(this.selectedFile);
      this.form.get('profilePicture')?.markAsTouched();

      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl.set(e.target?.result as string);
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  isValid(): boolean {
    return this.form.valid && this.selectedFile !== null;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.form.valid && this.selectedFile) {
      this.dialogRef.close(this.selectedFile);
    } else {
      this.formUtils.validateAllFormFields(this.form);
    }
  }
}
