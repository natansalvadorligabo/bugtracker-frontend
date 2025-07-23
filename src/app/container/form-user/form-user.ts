import { Location } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Role } from '../../model/role';
import { User } from '../../model/user';
import { AuthService } from '../../services/auth/auth-service.js';
import { UsersService } from '../../services/users/users-service';
import { FormUtilsService } from '../../shared/form/form-utils';

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
    MatProgressSpinnerModule,
  ],
  templateUrl: './form-user.html',
  styleUrl: './form-user.scss',
})
export class FormUser {
  form!: FormGroup;

  hide = signal(true);
  isSubmitting = false;
  isEditMode = false;
  userId: number | null = null;
  pageTitle = 'Novo Usuário';
  submitButtonText = 'Criar Usuário';
  user: User | null = null;

  private formBuilder = inject(FormBuilder);
  private userService = inject(UsersService);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  formUtils = inject(FormUtilsService);

  roles: Role[] = [];

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      userRoles: [[], [Validators.required]],
    });

    const userIdParam = this.route.snapshot.paramMap.get('id');
    if (userIdParam) {
      this.isEditMode = true;
      this.userId = Number(userIdParam);
      this.pageTitle = 'Editar Usuário';
      this.submitButtonText = 'Atualizar Usuário';
    }

    this.loadRoles();
  }

  private loadUserData(userId: number) {
    this.userService.getUserById(userId).subscribe({
      next: user => {
        this.user = user;

        const userRoleIds =
          user.roles
            ?.map(roleName => {
              const roleMapping: { [key: string]: string } = {
                ROLE_USER: 'Usuário Comum',
                ROLE_ADMIN: 'Administrador',
                ROLE_TECHNICIAN: 'Técnico',
                USER: 'Usuário Comum',
                ADMIN: 'Administrador',
                TECHNICIAN: 'Técnico',
              };

              let role = this.roles.find(r => r.name === roleName);

              if (!role && roleMapping[roleName]) {
                const mappedName = roleMapping[roleName];
                role = this.roles.find(r => r.name === mappedName);
              }

              if (!role && roleName.startsWith('ROLE_')) {
                const roleNameWithoutPrefix = roleName.replace('ROLE_', '');
                if (roleMapping[roleNameWithoutPrefix]) {
                  const mappedName = roleMapping[roleNameWithoutPrefix];
                  role = this.roles.find(r => r.name === mappedName);
                }
              }

              return role ? role.roleId : null;
            })
            .filter(id => id !== null) || [];

        this.form.patchValue({
          name: user.name,
          email: user.email,
          userRoles: userRoleIds,
        });
      },
      error: err => {
        this.snackBar.open('Erro ao carregar dados do usuário', 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });
        this.router.navigate(['/users']);
      },
    });
  }

  loadRoles() {
    this.authService.getRoles().subscribe({
      next: data => {
        this.roles = data;
        if (this.isEditMode && this.userId) {
          this.loadUserData(this.userId);
        }
      },
      error: err => {
        console.error('Erro ao carregar funções', err);
        this.snackBar.open('Erro ao carregar funções', 'Fechar', { duration: 3000 });
      },
    });
  }

  onSubmit() {
    if (this.isSubmitting) {
      return;
    }

    if (this.form.valid) {
      this.isSubmitting = true;

      if (this.isEditMode && this.userId) {
        const userData = {
          name: this.form.get('name')?.value,
          email: this.form.get('email')?.value,
          roles: this.form.get('userRoles')?.value,
        };

        this.userService.updateUserById(this.userId, userData).subscribe({
          next: () => {
            this.isSubmitting = false;
            this.snackBar.open('Usuário atualizado com sucesso!', 'Fechar', {
              duration: 3000,
              panelClass: ['snackbar-success'],
            });
            this.router.navigate(['/users']);
          },
          error: err => {
            this.isSubmitting = false;
            console.error(err);
            this.snackBar.open('Erro ao atualizar usuário.', 'Fechar', {
              duration: 3000,
              panelClass: ['snackbar-error'],
            });
          },
        });
      } else {
        const formDataForCreation = new FormData();
        formDataForCreation.append('name', this.form.get('name')?.value);
        formDataForCreation.append('email', this.form.get('email')?.value);

        // Corrigido: acessar o valor direto, não como propriedade aninhada
        this.form.get('userRoles')?.value.forEach((roleId: number) => {
          formDataForCreation.append('userRoles', roleId.toString());
        });

        this.authService.register(formDataForCreation).subscribe({
          next: () => {
            this.isSubmitting = false;
            this.snackBar.open('Usuário registrado com sucesso!', 'Fechar', { duration: 3000, panelClass: ['snackbar-success'] });
            this.form.reset();
          },
          error: err => {
            this.isSubmitting = false;
            console.error(err);
            this.snackBar.open('Erro ao registrar usuário.', 'Fechar', {
              duration: 3000,
              panelClass: ['snackbar-error'],
            });
          },
        });
      }
    } else {
      this.formUtils.validateAllFormFields(this.form);
    }
  }

  goBack() {
    this.location.back();
  }
}
