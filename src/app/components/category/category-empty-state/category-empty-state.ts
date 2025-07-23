import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-category-empty-state',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './category-empty-state.html',
  styleUrl: './category-empty-state.scss',
})
export class CategoryEmptyStateComponent {
  @Input() isAdmin = false;

  @Output() createCategory = new EventEmitter<void>();

  onCreateCategory() {
    this.createCategory.emit();
  }
}
