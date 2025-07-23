import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { User, UserPage } from '../../../model/user';

@Component({
  selector: 'app-user-table',
  imports: [MatButtonModule, MatIconModule, MatTableModule, MatPaginatorModule, MatChipsModule, MatTooltipModule],
  templateUrl: './user-table.html',
  styleUrl: './user-table.scss',
})
export class UserTableComponent {
  @Input() userPage: UserPage | null = null;
  @Input() isAdmin = false;
  @Input() pageIndex = 0;
  @Input() pageSize = 10;

  @Output() editUser = new EventEmitter<User>();
  @Output() deleteUser = new EventEmitter<User>();
  @Output() pageChange = new EventEmitter<PageEvent>();

  displayedColumns: string[] = ['name', 'email', 'roles', 'actions'];

  onEdit(user: User) {
    this.editUser.emit(user);
  }

  onDelete(user: User) {
    this.deleteUser.emit(user);
  }

  onPageChange(event: PageEvent) {
    this.pageChange.emit(event);
  }

  getRoleDisplayName(role: string): string {
    switch (role) {
      case 'ROLE_USER':
        return 'Normal';
      case 'ROLE_TECHNICIAN':
        return 'Técnico';
      case 'ROLE_ADMIN':
        return 'Administrador';
      default:
        return role;
    }
  }

  getRoleChipClass(role: string): string {
    switch (role) {
      case 'ROLE_USER':
        return 'role-user';
      case 'ROLE_TECHNICIAN':
        return 'role-technician';
      case 'ROLE_ADMIN':
        return 'role-admin';
      default:
        return 'role-default';
    }
  }
}
