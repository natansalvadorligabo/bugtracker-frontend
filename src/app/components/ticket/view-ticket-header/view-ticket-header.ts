import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-view-ticket-header',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './view-ticket-header.html',
})
export class ViewTicketHeaderComponent {
  @Input() isTechnician = false;

  @Output() goBack = new EventEmitter<void>();
  @Output() editTicket = new EventEmitter<void>();

  onGoBack() {
    this.goBack.emit();
  }

  onEditTicket() {
    this.editTicket.emit();
  }
}
