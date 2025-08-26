import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CodeVerificationStepComponent } from '../../components/auth/code-verification-step/code-verification-step';
import { EmailStepComponent } from '../../components/auth/email-step/email-step';
import { NewPasswordData, PasswordResetStepComponent } from '../../components/auth/password-reset-step/password-reset-step';
import { StepIndicatorComponent } from '../../components/auth/step-indicator/step-indicator';
import { VerifyCodeResponse } from '../../model/user';
import { AuthService } from '../../services/auth/auth-service';

@Component({
  selector: 'app-password-recovery',
  imports: [MatCardModule, MatIconModule, StepIndicatorComponent, EmailStepComponent, CodeVerificationStepComponent, PasswordResetStepComponent],
  templateUrl: './password-recovery.html',
  styleUrl: './password-recovery.scss',
})
export class PasswordRecovery {
  loading = signal(false);
  currentStep = signal(1);
  userEmail = signal('');
  token = signal('');

  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  onEmailSubmitted(email: string) {
    this.loading.set(true);
    this.userEmail.set(email);

    this.authService.recoveryPassword(email).subscribe({
      next: (response: any) => {
        this.currentStep.set(2);
        this.loading.set(false);
        this.snackBar.open('Código enviado para seu e-mail', 'Fechar', {
          duration: 5000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erro ao enviar código de recuperação:', error);
        this.snackBar.open('E-mail inválido ou não cadastrado no BugTracker.', 'Fechar', {
          duration: 5000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
        this.loading.set(false);
      },
    });
  }

  onCodeSubmitted(code: string) {
    this.loading.set(true);

    this.authService.verifyRecoveryCode(this.userEmail(), code).subscribe({
      next: (response: VerifyCodeResponse) => {
        this.token.set(response.resetToken);
        this.currentStep.set(3);
        this.loading.set(false);
        this.snackBar.open('Código verificado com sucesso', 'Fechar', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
      },
      error: (error: HttpErrorResponse) => {
        this.snackBar.open('Código inválido ou expirado.', 'Fechar', {
          duration: 5000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
        this.loading.set(false);
      },
    });
  }

  onPasswordSubmitted(passwordData: NewPasswordData) {
    this.loading.set(true);

    this.authService.resetPassword(this.userEmail(), passwordData.password, this.token()).subscribe({
      next: (response: any) => {
        this.snackBar.open('Senha alterada com sucesso!', 'Fechar', {
          duration: 5000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
        this.router.navigate(['/login']);
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.snackBar.open('Erro ao alterar senha.', 'Fechar', {
          duration: 5000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
        this.loading.set(false);
      },
    });
  }

  onBackClicked() {
    if (this.currentStep() > 1) {
      this.currentStep.set(this.currentStep() - 1);
    } else {
      this.router.navigate(['/login']);
    }
  }

  getStepTitle(): string {
    switch (this.currentStep()) {
      case 1:
        return 'Receber um código de verificação';
      case 2:
        return 'Verificar código';
      case 3:
        return 'Definir nova senha';
      default:
        return '';
    }
  }

  getStepDescription(): string {
    switch (this.currentStep()) {
      case 1:
        return 'Para receber um código de verificação, primeiro digite o seu e-mail em que sua conta foi cadastrada, para que possamos enviar o código de verificação.';
      case 2:
        return `Digite o código de verificação que foi enviado para ${this.userEmail()}.`;
      case 3:
        return 'Defina uma nova senha para sua conta. Certifique-se de que seja segura e fácil de lembrar.';
      default:
        return '';
    }
  }

  getSubmitButtonText(): string {
    switch (this.currentStep()) {
      case 1:
        return 'Enviar código';
      case 2:
        return 'Verificar código';
      case 3:
        return 'Alterar senha';
      default:
        return 'Seguinte';
    }
  }

  getBackButtonText(): string {
    return this.currentStep() === 1 ? 'Voltar' : 'Anterior';
  }
}
