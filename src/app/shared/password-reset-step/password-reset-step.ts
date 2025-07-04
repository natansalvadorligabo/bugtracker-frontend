import { Component, inject, input, output, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormUtilsService } from '../form/form-utils';

export interface NewPasswordData {
  password: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-password-reset-step',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  template: `
    <section class="mb-8">
      <h2 class="text-2xl mb-4">{{ title() }}</h2>
      <p class="text-gray-600">{{ description() }}</p>
    </section>

    <form [formGroup]="form" class="space-y-1">
      <mat-form-field appearance="outline" class="w-full">
        <mat-label>Nova senha</mat-label>
        <input
          matInput
          [type]="hidePassword() ? 'password' : 'text'"
          formControlName="password"
        />
        <button
          type="button"
          mat-icon-button
          matSuffix
          (click)="togglePasswordVisibility()"
          [attr.aria-label]="'Esconder senha'"
          [attr.aria-pressed]="hidePassword()"
        >
          <mat-icon>{{
            hidePassword() ? 'visibility_off' : 'visibility'
          }}</mat-icon>
        </button>
        @if (form.get('password')?.invalid && form.get('password')?.touched) {
        <mat-error>{{ formUtils.getErrorMessage(form, 'password') }}</mat-error>
        }
      </mat-form-field>

      <mat-form-field appearance="outline" class="w-full">
        <mat-label>Confirmar nova senha</mat-label>
        <input
          matInput
          [type]="hideConfirmPassword() ? 'password' : 'text'"
          formControlName="confirmPassword"
        />
        <button
          type="button"
          mat-icon-button
          matSuffix
          (click)="toggleConfirmPasswordVisibility()"
          [attr.aria-label]="'Esconder senha'"
          [attr.aria-pressed]="hideConfirmPassword()"
        >
          <mat-icon>{{
            hideConfirmPassword() ? 'visibility_off' : 'visibility'
          }}</mat-icon>
        </button>
        @if (form.get('confirmPassword')?.invalid &&
        form.get('confirmPassword')?.touched) {
        <mat-error>{{ getConfirmPasswordError() }}</mat-error>
        }
      </mat-form-field>

      <div class="flex justify-end items-center mt-8 gap-8">
        <button
          type="button"
          (click)="onBack()"
          class="text-blue-500 hover:text-blue-700 cursor-pointer"
        >
          {{ backButtonText() }}
        </button>

        <button
          type="button"
          mat-flat-button
          color="primary"
          (click)="onSubmit()"
          [disabled]="form.invalid || loading()"
          class="bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          @if (loading()) {
          <mat-progress-spinner
            diameter="20"
            mode="indeterminate"
            color="primary"
            class="mr-2"
            style="vertical-align: middle"
          >
          </mat-progress-spinner>
          } @else { {{ submitButtonText() }} }
        </button>
      </div>
    </form>
  `,
})
export class PasswordResetStepComponent {
  title = input.required<string>();
  description = input.required<string>();
  loading = input.required<boolean>();
  submitButtonText = input.required<string>();
  backButtonText = input.required<string>();

  passwordSubmitted = output<NewPasswordData>();
  backClicked = output<void>();

  hidePassword = signal(true);
  hideConfirmPassword = signal(true);

  form: FormGroup;
  formUtils = inject(FormUtilsService);

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: [
        '',
        [Validators.required, this.validateMatchPassword.bind(this)],
      ],
    });
  }

  private validateMatchPassword(
    control: AbstractControl
  ): ValidationErrors | null {
    const password = control.parent?.get('password')?.value;
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

  togglePasswordVisibility() {
    this.hidePassword.set(!this.hidePassword());
  }

  toggleConfirmPasswordVisibility() {
    this.hideConfirmPassword.set(!this.hideConfirmPassword());
  }

  onSubmit() {
    if (this.form.valid) {
      this.passwordSubmitted.emit({
        password: this.form.get('password')?.value,
        confirmPassword: this.form.get('confirmPassword')?.value,
      });
    } else {
      this.formUtils.validateAllFormFields(this.form);
    }
  }

  onBack() {
    this.backClicked.emit();
  }
}
