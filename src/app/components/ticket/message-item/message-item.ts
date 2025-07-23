import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Message } from '../../../model/message';
import { User } from '../../../model/user';

@Component({
  selector: 'app-message-item',
  imports: [CommonModule, MatIconModule, MatTooltipModule],
  templateUrl: './message-item.html',
})
export class MessageItemComponent {
  @Input() message!: Message;
  @Input() currentUser!: User;
  @Input() isEditingMessage = false;
  @Input() editingMessageId: number | null = null;

  @Output() editMessage = new EventEmitter<Message>();
  @Output() saveEditedMessage = new EventEmitter<void>();
  @Output() cancelEdit = new EventEmitter<void>();
  @Output() editKeydown = new EventEmitter<{ event: KeyboardEvent; messageId: number }>();

  onEditMessage() {
    this.editMessage.emit(this.message);
  }

  onSaveEditedMessage() {
    this.saveEditedMessage.emit();
  }

  onCancelEdit() {
    this.cancelEdit.emit();
  }

  onEditKeydown(event: KeyboardEvent) {
    this.editKeydown.emit({ event, messageId: this.message.messageId });
  }
}
