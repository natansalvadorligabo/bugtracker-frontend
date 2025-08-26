import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, Observable, of, tap } from 'rxjs';
import { UserEmptyStateComponent } from '../../components/user/user-empty-state/user-empty-state';
import { UserHeaderComponent } from '../../components/user/user-header/user-header';
import { UserLoadingComponent } from '../../components/user/user-loading/user-loading';
import { UserTableComponent } from '../../components/user/user-table/user-table';
import { User, UserPage } from '../../model/user';
import { AuthService } from '../../services/auth/auth-service';
import { UsersService } from '../../services/users/users-service';
import { ConfirmationDialog } from '../../shared/confirmation-dialog/confirmation-dialog';

@Component({
  selector: 'app-list-users',
  imports: [CommonModule, AsyncPipe, MatCardModule, UserHeaderComponent, UserTableComponent, UserEmptyStateComponent, UserLoadingComponent],
  templateUrl: './list-users.html',
  styleUrl: './list-users.scss',
})
export class ListUsers {
  private usersService = inject(UsersService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private _snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  users$: Observable<UserPage> | null = null;

  pageIndex = 0;
  pageSize = 10;

  displayedColumns: string[] = ['name', 'email', 'roles', 'actions'];

  get isAdmin(): boolean {
    return this.authService.isAdmin;
  }

  getCurrentUserCount(): number {
    let count = 0;
    this.users$?.subscribe(userPage => {
      count = userPage?.users?.length || 0;
    });
    return count;
  }

  ngOnInit() {
    this.refresh();
  }

  refresh(pageEvent: PageEvent = { length: 0, pageIndex: 0, pageSize: 10 }) {
    this.pageIndex = pageEvent.pageIndex;
    this.pageSize = pageEvent.pageSize;

    this.users$ = this.usersService.getUsers(this.pageIndex, this.pageSize).pipe(
      tap(() => {}),
      catchError(() => {
        this.openSnackBar('Erro ao carregar usuários', 'Fechar');
        return of({ users: [], totalElements: 0, totalPages: 0 });
      })
    );
  }

  onAdd() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  onEdit(user: User) {
    this.router.navigate(['edit', user.userId], { relativeTo: this.route });
  }

  onDelete(user: User) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        title: 'Remover usuário',
        content: 'Tem certeza que deseja remover este usuário?',
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.usersService.remove(user.userId).subscribe({
          next: () => {
            this.openSnackBar('Usuário removido com sucesso', 'X');
            this.refresh();
          },
          error: () => this.openSnackBar('Erro ao remover usuário', 'X'),
        });
      }
    });
  }

  openSnackBar(message: string, action?: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }
}
