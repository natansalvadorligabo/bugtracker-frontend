import { CommonModule, Location } from '@angular/common';
import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroupDirective, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewTicketDetailsComponent } from '../../components/ticket/view-ticket-details/view-ticket-details';
import { ViewTicketHeaderComponent } from '../../components/ticket/view-ticket-header/view-ticket-header';
import { ViewTicketMessagesComponent } from '../../components/ticket/view-ticket-messages/view-ticket-messages';
import { Message } from '../../model/message';
import { Ticket } from '../../model/ticket';
import { AuthService } from '../../services/auth/auth-service';
import { CommentService } from '../../services/comments/comment-service';
import { TicketCategoriesService } from '../../services/ticket-categories/ticket-categories-service';
import { TicketService } from '../../services/tickets/ticket-service';

export class NoErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return false;
  }
}

@Component({
  selector: 'app-view-ticket',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ViewTicketHeaderComponent, ViewTicketDetailsComponent, ViewTicketMessagesComponent],
  templateUrl: './view-ticket.html',
  styleUrl: './view-ticket.scss',
})
export class ViewTicket implements AfterViewChecked, AfterViewInit {
  @ViewChild(ViewTicketMessagesComponent) viewTicketMessagesComponent!: ViewTicketMessagesComponent;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private ticketService = inject(TicketService);
  private ticketCategoriesService = inject(TicketCategoriesService);
  private commentService = inject(CommentService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private snackBar = inject(MatSnackBar);

  ticket: Ticket | null = null;
  ticketCategory: string | null = null;
  ticketImages: string[] | null = null;
  ticketMessages: Message[] = [];
  isLoading = true;
  isLoadingMessages = true;
  isEditingMessage = false;
  isTechnician = false;
  editingMessageId: number | null = null;
  originalMessageText = '';
  currentUser = this.authService.getUserFromToken();
  private shouldScrollToBottom = false;

  messageForm = this.fb.group({
    message: ['', [Validators.required]],
  });

  noErrorMatcher = new NoErrorStateMatcher();

  trackMessage(index: number, message: Message): any {
    if (!message) return index;
    return message.messageId === -1 ? `temp-${message.timestamp}` : message.messageId;
  }

  getTicketStatusLabel(status: string): string {
    const statusMap: { [key: string]: string } = {
      PENDING: 'Pendente',
      ATTACHED: 'Atribuído',
      COMPLETED: 'Completo',
      STOPPED: 'Pausado',
    };
    return statusMap[status] || status;
  }

  getTicketStatusColor(status: string): string {
    const colorMap: { [key: string]: string } = {
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      ATTACHED: 'bg-orange-100 text-orange-800 border-orange-200',
      COMPLETED: 'bg-green-100 text-green-800 border-green-200',
      STOPPED: 'bg-red-100 text-red-800 border-red-200',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  }

  getStatusInfo(status: string) {
    const availableStatuses = [
      { value: 'PENDING', label: 'Pendente', color: 'text-yellow-500' },
      { value: 'ATTACHED', label: 'Atribuído', color: 'text-orange-500' },
      { value: 'STOPPED', label: 'Pausado', color: 'text-red-500' },
      { value: 'COMPLETED', label: 'Completo', color: 'text-green-500' },
    ];

    return (
      availableStatuses.find(s => s.value === status) || {
        value: status,
        label: status,
        color: 'text-gray-500',
      }
    );
  }

  ngOnInit() {
    this.isLoadingMessages = true;
    this.ticket = this.route.snapshot.data['ticket'];
    this.isTechnician = this.authService.isTechnician;

    this.loadCategoryService();
    /*  this.loadTicketImages(); */
    this.loadMessages();

    this.isLoading = false;
  }

  loadMessages() {
    if (!this.ticket) return;

    this.commentService.loadById(this.ticket.ticketId).subscribe({
      next: comments => {
        this.ticketMessages = comments.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

        this.isLoadingMessages = false;
        this.cdr.detectChanges();

        setTimeout(() => {
          this.scrollToBottom();
        }, 100);
      },
      error: err => {
        console.error('Erro ao carregar mensagens:', err);
        this.isLoadingMessages = false;
        this.cdr.detectChanges();
      },
    });
  }

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  ngAfterViewInit() {
    if (this.ticketMessages.length > 0 && !this.isLoadingMessages) {
      setTimeout(() => {
        this.scrollToBottom();
      }, 200);
    }
  }

  private scrollToBottom(): void {
    if (this.viewTicketMessagesComponent) {
      this.viewTicketMessagesComponent.scrollToBottom();
    }
  }

  loadCategoryService() {
    if (!this.ticket) return;

    this.ticketCategoriesService.getTicketCategoryById(this.ticket.ticketCategoryId).subscribe({
      next: category => {
        this.ticketCategory = category.description;
      },
      error: err => {
        console.error('Error fetching ticket category:', err);
      },
    });
  }

  loadTicketImages() {
    if (!this.ticket) return;

    this.ticketService.getTicketImagesById(this.ticket.ticketId).subscribe({
      next: (images: Blob[]) => {
        this.ticketImages = images.map(img => URL.createObjectURL(img));
      },
      error: err => {
        console.error('Error fetching ticket images:', err);
      },
    });
  }

  goBack() {
    this.location.back();
  }

  editTicket() {
    if (this.ticket?.ticketId) {
      this.router.navigate(['/tickets/edit', this.ticket.ticketId]);
    }
  }

  editMessage(message: Message) {
    if (message.messageId !== -1 && message.message) {
      this.isEditingMessage = true;
      this.editingMessageId = message.messageId;
      this.originalMessageText = message.message;

      setTimeout(() => {
        const textarea = document.getElementById(`message-${message.messageId}`) as HTMLTextAreaElement;
        if (textarea) {
          textarea.focus();
          textarea.select();
        }
      }, 100);
    }
  }

  cancelEdit() {
    if (this.editingMessageId) {
      const textarea = document.getElementById(`message-${this.editingMessageId}`) as HTMLTextAreaElement;
      if (textarea) {
        textarea.value = this.originalMessageText;
      }
    }

    this.isEditingMessage = false;
    this.editingMessageId = null;
    this.originalMessageText = '';
  }

  saveEditedMessage() {
    if (!this.editingMessageId) return;

    const textarea = document.getElementById(`message-${this.editingMessageId}`) as HTMLTextAreaElement;
    if (!textarea) return;

    const newMessage = textarea.value.trim();
    if (!newMessage) {
      return;
    }

    if (newMessage === this.originalMessageText) {
      this.cancelEdit();
      return;
    }

    const messageIndex = this.ticketMessages.findIndex(m => m.messageId === this.editingMessageId);
    if (messageIndex === -1) return;

    const oldMessage = this.ticketMessages[messageIndex].message;
    this.ticketMessages[messageIndex].message = newMessage;
    this.ticketMessages[messageIndex].wasEdited = true;

    this.isEditingMessage = false;
    const currentEditingId = this.editingMessageId;
    this.editingMessageId = null;
    this.originalMessageText = '';

    this.commentService.update(currentEditingId, newMessage).subscribe({
      next: updatedMessage => {
        const index = this.ticketMessages.findIndex(m => m && m.messageId === currentEditingId);
        if (index !== -1 && updatedMessage) {
          this.ticketMessages[index] = updatedMessage;
        }
        this.cdr.detectChanges();
      },
      error: err => {
        if (messageIndex !== -1) {
          this.ticketMessages[messageIndex].message = oldMessage;
          this.ticketMessages[messageIndex].wasEdited = false;
        }
        this.snackBar.open('Erro ao editar mensagem. Tente novamente.', 'Fechar', {
          verticalPosition: 'bottom',
          duration: 3000,
        });
        this.cdr.detectChanges();
      },
    });
  }

  onEditKeydown(event: KeyboardEvent, messageId: number) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.saveEditedMessage();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.cancelEdit();
    }
  }

  handleEditKeydown(eventData: { event: KeyboardEvent; messageId: number }) {
    this.onEditKeydown(eventData.event, eventData.messageId);
  }

  sendMessage() {
    if (this.messageForm.valid && this.ticket) {
      const now = new Date();
      const offsetMs = now.getTimezoneOffset() * 60000;
      const localTimestamp = new Date(now.getTime() - offsetMs).toISOString();

      const messageData = {
        ticketId: this.ticket.ticketId,
        senderId: this.authService?.getUserFromToken().userId,
        message: this.messageForm.value.message,
        timestamp: localTimestamp,
      };

      const optimisticMessage: Message = {
        messageId: -1,
        ticketId: messageData.ticketId,
        sender: this.authService.getUserFromToken(),
        message: messageData.message!,
        timestamp: messageData.timestamp,
        wasEdited: false,
      };

      this.ticketMessages.push(optimisticMessage);
      const tempTimestamp = messageData.timestamp;

      this.shouldScrollToBottom = true;
      this.isLoadingMessages = false;
      this.cdr.detectChanges();

      this.messageForm.reset();

      this.commentService.save(messageData).subscribe({
        next: savedMessage => {
          const index = this.ticketMessages.findIndex(m => m.messageId === -1 && m.timestamp === tempTimestamp);
          if (index !== -1) {
            this.ticketMessages[index] = savedMessage;
          }
          this.cdr.detectChanges();
        },
        error: err => {
          console.error('Error sending message:', err);
          const index = this.ticketMessages.findIndex(m => m.messageId === -1 && m.timestamp === tempTimestamp);
          if (index !== -1) {
            this.ticketMessages.splice(index, 1);
          }
          this.cdr.detectChanges();
        },
      });
    }
  }

  onKeydown(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === 'Enter') {
      event.preventDefault();
      this.sendMessage();
    }
  }
}
