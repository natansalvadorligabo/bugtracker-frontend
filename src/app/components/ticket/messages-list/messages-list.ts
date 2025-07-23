import { CommonModule } from '@angular/common';
import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { Message } from '../../../model/message';
import { User } from '../../../model/user';
import { MessageItemComponent } from '../message-item/message-item';

@Component({
  selector: 'app-messages-list',
  imports: [CommonModule, MessageItemComponent],
  templateUrl: './messages-list.html',
  styleUrl: './messages-list.scss',
})
export class MessagesListComponent implements AfterViewChecked, AfterViewInit {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  @Input() ticketMessages: Message[] = [];
  @Input() currentUser!: User;
  @Input() isEditingMessage = false;
  @Input() editingMessageId: number | null = null;

  @Output() editMessage = new EventEmitter<Message>();
  @Output() saveEditedMessage = new EventEmitter<void>();
  @Output() cancelEdit = new EventEmitter<void>();
  @Output() editKeydown = new EventEmitter<{ event: KeyboardEvent; messageId: number }>();

  private cdr = inject(ChangeDetectorRef);
  private shouldScrollToBottom = false;
  private lastMessageCount = 0;

  ngAfterViewInit(): void {
    this.scrollToBottom();
    this.lastMessageCount = this.ticketMessages.length;
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }

    // Auto scroll quando uma nova mensagem é adicionada
    if (this.ticketMessages.length > this.lastMessageCount) {
      this.scrollToBottom();
    }
    this.lastMessageCount = this.ticketMessages.length;
  }

  private scrollToBottom(): void {
    if (this.messagesContainer && this.messagesContainer.nativeElement) {
      const container = this.messagesContainer.nativeElement;

      requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight;

        setTimeout(() => {
          if (container.scrollTop < container.scrollHeight - container.clientHeight - 10) {
            container.scrollTop = container.scrollHeight;
          }
        }, 50);
      });
    }
  }

  public scrollToBottomPublic(): void {
    this.shouldScrollToBottom = true;
  }

  trackMessage(index: number, message: Message): any {
    return message ? message.messageId : index;
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

  onEditKeydown(eventData: { event: KeyboardEvent; messageId: number }) {
    this.editKeydown.emit(eventData);
  }
}
