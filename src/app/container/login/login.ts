import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LoginResponse } from '../../model/user';
import { AuthService } from '../../services/auth/auth-service.js';
import { FormUtilsService } from '../../shared/form/form-utils';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    RouterModule,
    MatProgressSpinnerModule,
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
  loading = signal(false);

  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);
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
      this.loading.set(true);
      this.authService.login(this.form.value).subscribe({
        next: (response: any) => {
          let loginResponse = response as LoginResponse;
          if (loginResponse.token) {
            this.authService.setToken(loginResponse.token);
          }

          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          this.router.navigate([returnUrl]);
          this.loading.set(false);
        },
        error: (error: HttpErrorResponse) => {
          this.snackBar.open('E-mail ou senha incorretos.', 'Fechar', {
            duration: 2000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
          });
          this.loading.set(false);
        },
      });
    } else {
      this.formUtils.validateAllFormFields(this.form);
    }
  }
}
