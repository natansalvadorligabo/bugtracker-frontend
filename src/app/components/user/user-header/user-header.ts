import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-header',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './user-header.html',
  styleUrl: './user-header.scss',
})
export class UserHeaderComponent {
  @Input() userCount = 0;
  @Input() isAdmin = false;

  @Output() createUser = new EventEmitter<void>();

  onCreateUser() {
    this.createUser.emit();
  }
}
