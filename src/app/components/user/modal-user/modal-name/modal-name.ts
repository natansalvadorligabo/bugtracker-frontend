import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormUtilsService } from '../../../../shared/form/form-utils';

export interface ModalNameData {
  title: string;
  currentValue: string;
  placeholder?: string;
}

@Component({
  selector: 'app-modal-name',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule, MatIconModule],
  template: `
    <div class="p-6">
      <h2
        mat-dialog-title
        class="text-xl font-semibold mb-4"
      >
        {{ data.title }}
      </h2>

      <mat-dialog-content>
        <form
          [formGroup]="form"
          class="space-y-1 pt-4"
        >
          <mat-form-field
            appearance="outline"
            class="w-full"
          >
            <mat-label>{{ data.placeholder || data.title }}</mat-label>
            <input
              matInput
              type="text"
              formControlName="name"
              [placeholder]="data.placeholder || ''"
            />
            <mat-icon matSuffix>person</mat-icon>
            @if (form.get('name')?.invalid) {
            <mat-error>{{ formUtils.getErrorMessage(form, 'name') }}</mat-error>
            }
          </mat-form-field>
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
          [disabled]="form.invalid"
          class="bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Salvar
        </button>
      </mat-dialog-actions>
    </div>
  `,
})
export class ModalNameComponent {
  form: FormGroup;
  formUtils = inject(FormUtilsService);

  constructor(public dialogRef: MatDialogRef<ModalNameComponent>, @Inject(MAT_DIALOG_DATA) public data: ModalNameData, private fb: FormBuilder) {
    this.form = this.fb.group({
      name: [data.currentValue, [Validators.required, Validators.minLength(2)]],
    });
  }

  isValid(): boolean {
    return this.form.valid;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.get('name')?.value);
    } else {
      this.formUtils.validateAllFormFields(this.form);
    }
  }
}
