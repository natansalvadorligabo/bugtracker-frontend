import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TicketCategory } from '../../../model/ticket-categories';

@Component({
  selector: 'app-category-table',
  imports: [MatButtonModule, MatIconModule, MatTableModule, MatTooltipModule],
  templateUrl: './category-table.html',
})
export class CategoryTableComponent {
  @Input() categories: TicketCategory[] = [];
  @Input() isAdmin = false;

  @Output() editCategory = new EventEmitter<number>();
  @Output() deleteCategory = new EventEmitter<TicketCategory>();

  displayedColumns: string[] = ['description', 'actions'];

  onEdit(categoryId: number) {
    this.editCategory.emit(categoryId);
  }

  onDelete(category: TicketCategory) {
    this.deleteCategory.emit(category);
  }
}
