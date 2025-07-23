import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Ticket } from '../../../model/ticket';

@Component({
  selector: 'app-view-ticket-header',
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './view-ticket-header.html',
})
export class ViewTicketHeaderComponent {
  @Input() isTechnician = false;
  @Input() ticket: Ticket | null = null;
  @Input() isAssigningTicket = false;

  @Output() goBack = new EventEmitter<void>();
  @Output() editTicket = new EventEmitter<void>();
  @Output() assignTicket = new EventEmitter<void>();

  onGoBack() {
    this.goBack.emit();
  }

  onEditTicket() {
    this.editTicket.emit();
  }

  onAssignTicket() {
    this.assignTicket.emit();
  }

  get canAssignTicket(): boolean {
    return this.isTechnician && this.ticket !== null && !this.ticket.receiver;
  }
}
