import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-ticket-header',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './ticket-header.html'
})
export class TicketHeaderComponent {
  @Input() ticketCount: number = 0;
  @Input() showOnlyMyTickets: boolean = true;
  @Input() currentViewLabel: string = '';
  @Input() canCreateTicket: boolean = false;
  
  @Output() toggleView = new EventEmitter<void>();
  @Output() createTicket = new EventEmitter<void>();

  onToggleView() {
    this.toggleView.emit();
  }

  onCreateTicket() {
    this.createTicket.emit();
  }
}