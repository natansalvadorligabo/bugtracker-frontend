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

  private formBuilder = inject(FormBuilder);
  private userService = inject(UsersService);
  private snackBar = inject(MatSnackBar);
  formUtils = inject(FormUtilsService);

  roles: any[] = [];

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      userRole: ['', [Validators.required]]
    });

    this.loadRoles();
  }

  loadCategories() {
    this.roleService.getRoles().subscribe({
      next: (data) => this.roles = data,
      error: (err) => {
        console.error('Erro ao carregar funções', err);
        this.snackBar.open('Erro ao carregar funções', 'Fechar', { duration: 3000 });
      }
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.userService.register(this.form.value).subscribe({
        next: (data) => {
          this.snackBar.open(
            'Usuário registrado com sucesso!' , 'Fechar',
            { duration: 3000, panelClass: ['snackbar-success'] }
          );
        },
        error: (err) => {
          console.error(err);
        },
      });
    } else {
      this.formUtils.validateAllFormFields(this.form);
    }
  }
}
