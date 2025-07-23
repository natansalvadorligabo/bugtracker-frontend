import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-category-header',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './category-header.html',
})
export class CategoryHeaderComponent {
  @Input() categoryCount = 0;
  @Input() isAdmin = false;

  @Output() createCategory = new EventEmitter<void>();

  onCreateCategory() {
    this.createCategory.emit();
  }
}
