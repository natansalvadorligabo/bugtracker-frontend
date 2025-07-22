import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Ticket } from '../../model/ticket';
import { TicketCategory } from '../../model/ticket-categories';

@Component({
  selector: 'app-ticket-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './ticket-card.html'
})
export class TicketCardComponent {
  @Input() ticket!: Ticket;
  @Input() tags: TicketCategory[] = [];
  @Input() statusInfo: any = {};
  @Input() showOnlyMyTickets: boolean = true;
  @Input() senderName: string = '';
  
  @Output() ticketClick = new EventEmitter<number>();

  onTicketClick() {
    if (this.ticket?.ticketId) {
      this.ticketClick.emit(this.ticket.ticketId);
    }
  }
}