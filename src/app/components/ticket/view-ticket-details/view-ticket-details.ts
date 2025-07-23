import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { Ticket } from '../../../model/ticket';

@Component({
  selector: 'app-view-ticket-details',
  imports: [CommonModule, MatCardModule, MatIconModule, MatDividerModule, MatChipsModule],
  templateUrl: './view-ticket-details.html',
})
export class ViewTicketDetailsComponent {
  @Input() ticket: Ticket | null = null;
  @Input() ticketCategory: string = '';
  @Input() ticketImages: string[] = [];

  // Métodos helper que devem ser passados do componente pai
  @Input() getTicketStatusColor!: (status: string) => string;
  @Input() getTicketStatusLabel!: (status: string) => string;
}
