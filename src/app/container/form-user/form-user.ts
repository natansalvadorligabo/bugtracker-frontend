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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { UsersService } from '../../services/users/users-service';
import { FormUtilsService } from '../../shared/form/form-utils';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../services/auth/auth-service.js';
import { Role } from '../../model/role';

@Component({
  selector: 'app-form-user',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatCardModule,
    MatCheckboxModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './form-user.html',
  styleUrl: './form-user.scss'
})
export class FormUser {
form!: FormGroup;

  hide = signal(true);
  isSubmitting = false;

  private formBuilder = inject(FormBuilder);
  private userService = inject(UsersService);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private location = inject(Location);
  formUtils = inject(FormUtilsService);

  roles: Role[] = [];

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      userRoles: [[], [Validators.required]]
    });

    this.loadRoles();
  }

  loadRoles() {
    this.authService.getRoles().subscribe({
      next: (data) => { this.roles = data },
      error: (err) => {
        console.error('Erro ao carregar funções', err);
        this.snackBar.open('Erro ao carregar funções', 'Fechar', { duration: 3000 });
      }
    });
  }

  onSubmit() {
    if (this.isSubmitting) {
      return;
    }

    if (this.form.valid) {
      this.isSubmitting = true;

      const selectedRoleIds = this.form.get('userRoles')?.value;

      const formData = new FormData();
      formData.append('name', this.form.get('name')?.value);
      formData.append('email', this.form.get('email')?.value);

      selectedRoleIds.forEach((roleId: number) => {
        formData.append('userRoles', roleId.toString());
      });

      this.authService.register(formData).subscribe({
        next: (data) => {
          this.isSubmitting = false;
          this.snackBar.open(
            'Usuário registrado com sucesso!' , 'Fechar',
            { duration: 3000, panelClass: ['snackbar-success'] }
          );

          this.form.reset();
        },
        error: (err) => {
          this.isSubmitting = false;
          console.error(err);
          this.snackBar.open('Erro ao registrar usuário.', 'Fechar', {
            duration: 3000,
            panelClass: ['snackbar-error'],
          });
        },
      });
    } else {
      this.formUtils.validateAllFormFields(this.form);
    }
  }

  goBack() {
    this.location.back();
  }
}
