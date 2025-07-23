import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-category-loading',
  imports: [MatProgressSpinnerModule],
  templateUrl: './category-loading.html',
  styleUrl: './category-loading.scss',
})
export class CategoryLoadingComponent {}
