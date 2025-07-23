import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
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
      <div [class]="rowClasses" (click)="onClick()">
        @if (imgSrc) {
        <img
          [src]="imgSrc"
          alt="{{ text }}"
          class="rounded-full w-12 h-12 object-cover"
        />
        } @else {
        <span class="text-gray-600">{{ text }}</span>
        } @if (isClickableField) {
        <mat-icon class="text-gray-400">chevron_right</mat-icon>
        }
      </div>
    </div>

    @if (line) {
    <mat-divider></mat-divider>
    }
  `,
})
export class ProfileRowLinkComponent implements OnInit, OnChanges {
  @Input() rowName = '';
  @Input() text = '';
  @Input() description = '';
  @Input() line = true;
  @Input() imgSrc: string | null = null;
  @Output() rowClick = new EventEmitter<void>();

  isClickableField = false;
  rowClasses = '';

  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.computeProperties();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['rowName'] || changes['imgSrc']) {
      setTimeout(() => {
        this.computeProperties();
        this.cdr.detectChanges();
      }, 0);
    }
  }

  private computeProperties() {
    const wasClickable = this.isClickableField;
    const oldClasses = this.rowClasses;

    this.isClickableField = !this.rowName.toLowerCase().includes('e-mail');

    const baseClasses = 'flex items-center gap-2';
    const clickableClasses =
      'cursor-pointer hover:bg-gray-100 rounded-lg px-3 py-2 -mr-1';

    this.rowClasses = this.isClickableField
      ? `${baseClasses} ${clickableClasses}`
      : baseClasses;

    if (
      wasClickable !== this.isClickableField ||
      oldClasses !== this.rowClasses
    ) {
      this.cdr.markForCheck();
    }
  }

  onClick(): void {
    if (this.isClickableField) {
      this.rowClick.emit();
    }
  }
}
