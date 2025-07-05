import { Component, inject, input, output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormUtilsService } from '../form/form-utils';

@Component({
  selector: 'app-email-step',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <section class="mb-8">
      <h2 class="text-2xl mb-4">{{ title() }}</h2>
      <p class="text-gray-600">{{ description() }}</p>
    </section>

    <form [formGroup]="form" class="space-y-1">
      <mat-form-field appearance="outline" class="w-full">
        <mat-label>E-mail</mat-label>
        <input matInput formControlName="email" />
        @if (form.get('email')?.invalid && form.get('email')?.touched) {
        <mat-error>{{ formUtils.getErrorMessage(form, 'email') }}</mat-error>
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
export class EmailStepComponent {
  title = input.required<string>();
  description = input.required<string>();
  loading = input.required<boolean>();
  submitButtonText = input.required<string>();
  backButtonText = input.required<string>();

  emailSubmitted = output<string>();
  backClicked = output<void>();

  form: FormGroup;
  formUtils = inject(FormUtilsService);

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.emailSubmitted.emit(this.form.get('email')?.value);
    } else {
      this.formUtils.validateAllFormFields(this.form);
    }
  }

  onBack() {
    this.backClicked.emit();
  }
}
