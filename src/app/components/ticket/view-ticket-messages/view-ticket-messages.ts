import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { Message } from '../../../model/message';
import { User } from '../../../model/user';
import { MessageFormComponent } from '../message-form/message-form';
import { MessagesEmptyStateComponent } from '../messages-empty-state/messages-empty-state';
import { MessagesListComponent } from '../messages-list/messages-list';
import { MessagesLoadingComponent } from '../messages-loading/messages-loading';

@Component({
  selector: 'app-view-ticket-messages',
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    MessagesLoadingComponent,
    MessagesListComponent,
    MessagesEmptyStateComponent,
    MessageFormComponent,
  ],
  templateUrl: './view-ticket-messages.html',
  styleUrl: './view-ticket-messages.scss',
})
export class ViewTicketMessagesComponent {
  @ViewChild(MessagesListComponent) messagesListComponent!: MessagesListComponent;

  @Input() ticketMessages: Message[] = [];
  @Input() isLoadingMessages = false;
  @Input() currentUser!: User;
  @Input() messageForm!: FormGroup;
  @Input() isEditingMessage = false;
  @Input() editingMessageId: number | null = null;
  @Input() noErrorMatcher: any;

  @Output() sendMessage = new EventEmitter<void>();
  @Output() editMessage = new EventEmitter<Message>();
  @Output() saveEditedMessage = new EventEmitter<void>();
  @Output() cancelEdit = new EventEmitter<void>();
  @Output() keydown = new EventEmitter<KeyboardEvent>();
  @Output() editKeydown = new EventEmitter<{ event: KeyboardEvent; messageId: number }>();

  trackMessage(index: number, message: Message): any {
    return message ? message.messageId : index;
  }

  public scrollToBottom(): void {
    if (this.messagesListComponent) {
      this.messagesListComponent.scrollToBottomPublic();
    }
  }

  onSendMessage() {
    this.sendMessage.emit();
  }

  onEditMessage(message: Message) {
    this.editMessage.emit(message);
  }

  onSaveEditedMessage() {
    this.saveEditedMessage.emit();
  }

  onCancelEdit() {
    this.cancelEdit.emit();
  }

  onKeydown(event: KeyboardEvent) {
    this.keydown.emit(event);
  }

  onEditKeydown(event: KeyboardEvent, messageId: number) {
    this.editKeydown.emit({ event, messageId });
  }
}
