import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { TicketCategory } from '../../../model/ticket-categories';

@Component({
  selector: 'app-ticket-filters',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, MatChipsModule, MatIconModule, MatButtonModule],
  templateUrl: './ticket-filters.html',
})
export class TicketFiltersComponent {
  @Input() availableTags: TicketCategory[] = [];
  @Input() selectedTags: TicketCategory[] = [];
  @Input() selectedStatuses: string[] = [];

  @Output() toggleTag = new EventEmitter<TicketCategory>();
  @Output() toggleStatus = new EventEmitter<string>();
  @Output() clearTags = new EventEmitter<void>();
  @Output() clearStatuses = new EventEmitter<void>();
  @Output() clearFilters = new EventEmitter<void>();

  availableStatuses = [
    { value: 'PENDING', label: 'Pendente', color: 'text-yellow-500' },
    { value: 'ATTACHED', label: 'Atribuído', color: 'text-orange-500' },
    { value: 'STOPPED', label: 'Pausado', color: 'text-red-500' },
    { value: 'COMPLETED', label: 'Completo', color: 'text-green-500' },
  ];

  onToggleTag(tag: TicketCategory) {
    this.toggleTag.emit(tag);
  }

  onToggleStatus(status: string) {
    this.toggleStatus.emit(status);
  }

  isTagSelected(category: TicketCategory): boolean {
    return this.selectedTags.includes(category);
  }

  isStatusSelected(status: string): boolean {
    return this.selectedStatuses.includes(status);
  }

  onClearTags() {
    this.clearTags.emit();
  }

  onClearStatuses() {
    this.clearStatuses.emit();
  }

  onClearFilters() {
    this.clearFilters.emit();
  }
}
