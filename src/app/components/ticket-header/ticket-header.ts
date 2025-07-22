import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-ticket-header',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './ticket-header.html'
})
export class TicketHeaderComponent {
  @Input() ticketCount: number = 0;
  @Input() showOnlyMyTickets: boolean = true;
  @Input() currentViewLabel: string = '';
  
  @Output() toggleView = new EventEmitter<void>();

  onToggleView() {
    this.toggleView.emit();
  }
}