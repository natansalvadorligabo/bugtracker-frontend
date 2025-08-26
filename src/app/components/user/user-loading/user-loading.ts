import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-user-loading',
  imports: [MatProgressSpinnerModule],
  templateUrl: './user-loading.html',
  styleUrl: './user-loading.scss',
})
export class UserLoadingComponent {}
