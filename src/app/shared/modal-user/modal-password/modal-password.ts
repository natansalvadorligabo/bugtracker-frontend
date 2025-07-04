import { Component, Inject, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormUtilsService } from '../../form/form-utils';

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
    ReactiveFormsModule,
    MatIconModule,
  ],
  template: `
    <div class="p-6">
      <h2 mat-dialog-title class="text-xl font-semibold mb-4">
        {{ data.title }}
      </h2>

      <mat-dialog-content>
        <form [formGroup]="form" class="space-y-1 pt-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Senha atual</mat-label>
            <input
              matInput
              [type]="hideCurrentPassword() ? 'password' : 'text'"
              formControlName="currentPassword"
              placeholder="Digite sua senha atual"
            />
            <button
              type="button"
              mat-icon-button
              matSuffix
              (click)="toggleCurrentPasswordVisibility()"
              [attr.aria-label]="'Mostrar senha atual'"
            >
              <mat-icon>{{
                hideCurrentPassword() ? 'visibility_off' : 'visibility'
              }}</mat-icon>
            </button>
            @if (form.get('currentPassword')?.invalid) {
            <mat-error>{{
              formUtils.getErrorMessage(form, 'currentPassword')
            }}</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Nova senha</mat-label>
            <input
              matInput
              [type]="hideNewPassword() ? 'password' : 'text'"
              formControlName="newPassword"
              placeholder="Digite sua nova senha"
            />
            <button
              type="button"
              mat-icon-button
              matSuffix
              (click)="toggleNewPasswordVisibility()"
              [attr.aria-label]="'Mostrar nova senha'"
            >
              <mat-icon>{{
                hideNewPassword() ? 'visibility_off' : 'visibility'
              }}</mat-icon>
            </button>
            @if (form.get('newPassword')?.invalid) {
            <mat-error>{{
              formUtils.getErrorMessage(form, 'newPassword')
            }}</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Confirmar nova senha</mat-label>
            <input
              matInput
              [type]="hideConfirmPassword() ? 'password' : 'text'"
              formControlName="confirmPassword"
              placeholder="Confirme sua nova senha"
            />
            <button
              type="button"
              mat-icon-button
              matSuffix
              (click)="toggleConfirmPasswordVisibility()"
              [attr.aria-label]="'Mostrar confirmação de senha'"
            >
              <mat-icon>{{
                hideConfirmPassword() ? 'visibility_off' : 'visibility'
              }}</mat-icon>
            </button>
            @if (form.get('confirmPassword')?.invalid) {
            <mat-error>{{ getConfirmPasswordError() }}</mat-error>
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
export class ModalPasswordComponent {
  form: FormGroup;
  formUtils = inject(FormUtilsService);

  hideCurrentPassword = signal(true);
  hideNewPassword = signal(true);
  hideConfirmPassword = signal(true);

  constructor(
    public dialogRef: MatDialogRef<ModalPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalPasswordData,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: [
        '',
        [Validators.required, this.validateMatchPassword.bind(this)],
      ],
    });

    // Listener para revalidar confirmação quando nova senha mudar
    this.form.get('newPassword')?.valueChanges.subscribe(() => {
      this.form.get('confirmPassword')?.updateValueAndValidity();
    });
  }

  private validateMatchPassword(
    control: AbstractControl
  ): ValidationErrors | null {
    const password = control.parent?.get('newPassword')?.value;
    const confirmPassword = control.value;
    return password === confirmPassword ? null : { notMatch: true };
  }

  getConfirmPasswordError(): string {
    const control = this.form.get('confirmPassword');
    if (control?.hasError('required')) {
      return 'Campo obrigatório';
    }
    if (control?.hasError('notMatch')) {
      return 'As senhas não conferem';
    }
    return 'Campo inválido';
  }

  toggleCurrentPasswordVisibility() {
    this.hideCurrentPassword.set(!this.hideCurrentPassword());
  }

  toggleNewPasswordVisibility() {
    this.hideNewPassword.set(!this.hideNewPassword());
  }

  toggleConfirmPasswordVisibility() {
    this.hideConfirmPassword.set(!this.hideConfirmPassword());
  }

  isValid(): boolean {
    return this.form.valid;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.form.valid) {
      this.dialogRef.close({
        oldPassword: this.form.get('currentPassword')?.value,
        newPassword: this.form.get('newPassword')?.value,
      });
    } else {
      this.formUtils.validateAllFormFields(this.form);
    }
  }
}
