import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-ticket-loading',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  templateUrl: './ticket-loading.html'
})
export class TicketLoadingComponent { }