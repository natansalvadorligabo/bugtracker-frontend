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
import { UsersService } from '../../services/users/users-service';
import { FormUtilsService } from '../../shared/form/form-utils';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { RoleService } from '../../services/roles/role-service.js';
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
    MatSnackBarModule
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
  private roleService = inject(RoleService);
  private snackBar = inject(MatSnackBar);
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
    this.roleService.getRoles().subscribe({
      next: (data) => { this.roles = data },
      error: (err) => {
        console.error('Erro ao carregar funções', err);
        this.snackBar.open('Erro ao carregar funções', 'Fechar', { duration: 3000 });
      }
    });
  }

  onSubmit() {
    if (this.isSubmitting) {
      return; // Previne múltiplos submits
    }

    if (this.form.valid) {
      this.isSubmitting = true; // Inicia o loading

      const selectedRoleIds = this.form.get('userRoles')?.value;

      const formData = new FormData();
      formData.append('name', this.form.get('name')?.value);
      formData.append('email', this.form.get('email')?.value);

      selectedRoleIds.forEach((roleId: number) => {
        formData.append('userRoles', roleId.toString());
      });

      this.userService.register(formData).subscribe({
        next: (data) => {
          this.isSubmitting = false; // Para o loading
          this.snackBar.open(
            'Usuário registrado com sucesso!' , 'Fechar',
            { duration: 3000, panelClass: ['snackbar-success'] }
          );
          
          // Reset do formulário após sucesso
          this.form.reset();
        },
        error: (err) => {
          this.isSubmitting = false; // Para o loading em caso de erro
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
}
