import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-ticket-empty-state',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './ticket-empty-state.html'
})
export class TicketEmptyStateComponent {
  @Input() showOnlyMyTickets: boolean = true;
  @Input() isSearching: boolean = false;
  @Input() isFiltering: boolean = false;
  @Input() selectedTagsCount: number = 0;
  @Input() selectedStatusesCount: number = 0;
  
  @Output() clearSearch = new EventEmitter<void>();
  @Output() clearTags = new EventEmitter<void>();
  @Output() clearStatuses = new EventEmitter<void>();
  @Output() clearFilters = new EventEmitter<void>();

  onClearSearch() {
    this.clearSearch.emit();
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