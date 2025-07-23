import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-message-form',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './message-form.html',
  styleUrl: './message-form.scss',
})
export class MessageFormComponent {
  @Input() messageForm!: FormGroup;
  @Input() noErrorMatcher: any;

  @Output() sendMessage = new EventEmitter<void>();
  @Output() keydown = new EventEmitter<KeyboardEvent>();

  onSendMessage() {
    this.sendMessage.emit();
  }

  onKeydown(event: KeyboardEvent) {
    this.keydown.emit(event);
  }
}
