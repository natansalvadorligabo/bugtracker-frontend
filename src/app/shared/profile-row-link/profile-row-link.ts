import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'profile-row-link',
  standalone: true,
  imports: [MatIconModule, MatDividerModule],
  template: `
    <div class="flex items-center justify-between py-4 w-full rounded-lg px-2">
      <div class="flex flex-col gap-1">
        <span class="text-gray-700 font-medium">{{ rowName }}</span>
        <span class="text-gray-500 text-sm">{{ description }}</span>
      </div>
      <div
        class="flex items-center gap-2"
        [class.cursor-pointer]="isClickable()"
        [class.hover:bg-gray-100]="isClickable()"
        [class.rounded-lg]="isClickable()"
        [class.px-3]="isClickable()"
        [class.py-2]="isClickable()"
        [class.-mr-1]="isClickable()"
        (click)="onClick()"
      >
        @if (imgSrc) {
        <img
          [src]="imgSrc"
          alt="{{ text }}"
          class="rounded-full w-12 h-12 object-cover"
        />} @else {
        <span class="text-gray-600">{{ text }}</span>
        } @if (isClickable()) {
        <mat-icon class="text-gray-400">chevron_right</mat-icon>
        }
      </div>
    </div>

    @if (line) {
    <mat-divider></mat-divider>
    }
  `,
})
export class ProfileRowLinkComponent {
  @Input() rowName = '';
  @Input() text = '';
  @Input() description = '';
  @Input() line = true;
  @Input() imgSrc: string | null = null;
  @Output() rowClick = new EventEmitter<void>();

  isClickable(): boolean {
    return !this.rowName.includes('e-mail');
  }

  onClick(): void {
    if (this.isClickable()) {
      this.rowClick.emit();
    }
  }
}
