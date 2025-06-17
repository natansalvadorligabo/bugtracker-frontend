import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { UsersService } from '../../services/users-service';
import { FormUtilsService } from '../../shared/form/form-utils';

@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatCheckboxModule,
    MatButtonModule,
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {

  form!: FormGroup;

  hide = signal(true);

  private formBuilder = inject(FormBuilder);
  private userService = inject(UsersService);
  formUtils = inject(FormUtilsService);

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          this.validateMatchPassword,
        ],
      ],
    });
  }

  togglePasswordVisibility() {
    this.hide.set(!this.hide());
  }

  onSubmit() {
    if (this.form.valid) {
      this.userService.register(this.form.value).subscribe({
        next: (data) => {
          alert('Usuário registrado com sucesso!');
        },
        error: (err) => {
          console.error(err);
        },
      });
    } else {
      this.formUtils.validateAllFormFields(this.form);
    }
  }

  private validateMatchPassword(
    control: AbstractControl
  ): ValidationErrors | null {
    const password = control.parent?.get('password');
    const confirmPassword = control.parent?.get('confirmPassword');
    return password?.value == confirmPassword?.value
      ? null
      : { notMatch: true };
  }
}
