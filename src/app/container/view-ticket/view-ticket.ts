import { CommonModule, Location } from '@angular/common';
import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroupDirective, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router } from '@angular/router';
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
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatToolbarModule,
    MatBadgeModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  templateUrl: './view-ticket.html',
  styleUrl: './view-ticket.scss',
})
export class ViewTicket implements AfterViewChecked, AfterViewInit {
  @ViewChild('messagesContainer', { static: false })
  messagesContainer!: ElementRef;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private ticketService = inject(TicketService);
  private ticketCategoriesService = inject(TicketCategoriesService);
  private commentService = inject(CommentService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  ticket: Ticket | null = null;
  ticketCategory: string | null = null;
  ticketImages: string[] | null = null;
  ticketMessages: Message[] = [];
  isLoading = true;
  isLoadingMessages = true;
  private shouldScrollToBottom = false;

  messageForm = this.fb.group({
    message: ['', [Validators.required]],
  });

  noErrorMatcher = new NoErrorStateMatcher();

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

    this.loadCategoryService();
    this.loadTicketImages();
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

  sendMessage() {
    if (this.messageForm.valid && this.ticket) {
      const now = new Date();
      const offsetMs = now.getTimezoneOffset() * 60000;
      const localTimestamp = new Date(now.getTime() - offsetMs).toISOString();

      const messageData = {
        ticketId: this.ticket.ticketId,
        senderId: this.authService.getUserFromToken().userId,
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
