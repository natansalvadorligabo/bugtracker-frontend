import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { LoginResponse } from '../../model/user';
import { UsersService } from '../../services/users-service';
import { FormUtilsService } from '../../shared/form/form-utils';
import { AuthService } from '../../services/auth-service.js';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatCheckboxModule,
    MatButtonModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  form!: FormGroup;

  hide = signal(true);

  private formBuilder = inject(FormBuilder);
  private userService = inject(UsersService);
  private router = inject(Router);
  private authService = inject(AuthService);

  formUtils = inject(FormUtilsService);

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  togglePasswordVisibility() {
    this.hide.set(!this.hide());
  }

  onSubmit() {
    if (this.form.valid) {
      this.userService.login(this.form.value).subscribe({
        next: (response: any) => {
          let loginResponse = response as LoginResponse;
          if (loginResponse.token)
            //ocalStorage.setItem('token', loginResponse.token);
            this.authService.setToken(loginResponse.token);

          this.router.navigate(['/home']);
        },
        error: (error: Error) => {
          this.formUtils.setErrorMessage(
            this.form,
            'password',
            'Usuário ou senha inválidos'
          );
        },
      });
    } else {
      this.formUtils.validateAllFormFields(this.form);
    }
  }
}
