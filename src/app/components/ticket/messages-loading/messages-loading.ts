import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-messages-loading',
  imports: [MatProgressSpinnerModule],
  templateUrl: './messages-loading.html',
})
export class MessagesLoadingComponent {}
