import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-empty-state',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './user-empty-state.html',
  styleUrl: './user-empty-state.scss',
})
export class UserEmptyStateComponent {
  @Input() isAdmin = false;

  @Output() createUser = new EventEmitter<void>();

  onCreateUser() {
    this.createUser.emit();
  }
}
