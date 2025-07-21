import { CommonModule, DatePipe, Location } from '@angular/common';
import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
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
@Component({
  selector: 'app-view-ticket',
  imports: [
    CommonModule,
    DatePipe,
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
  ],
  templateUrl: './view-ticket.html',
  styleUrl: './view-ticket.scss',
})
export class ViewTicket implements AfterViewChecked {
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

  readonly MAX_VISIBLE_MESSAGES = 5;
  showAllMessages = true;
  private shouldScrollToBottom = false;
  messageForm = this.fb.group({
    message: ['', [Validators.required]],
  });

  get displayedMessages(): Message[] {
    return this.ticketMessages;
  }

  get hasHiddenMessages(): boolean {
    return false;
  }

  get hiddenMessagesCount(): number {
    return 0;
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
      next: (comments) => {
        this.ticketMessages = comments.sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

        this.isLoadingMessages = false;
        this.cdr.detectChanges();

        this.shouldScrollToBottom = true;
      },
      error: (err) => {
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

  private scrollToBottom(): void {
    if (this.messagesContainer && this.messagesContainer.nativeElement) {
      const container = this.messagesContainer.nativeElement;
      setTimeout(() => {
        container.scrollTop = container.scrollHeight;
      }, 0);
    }
  }

  private scrollToRecentMessages(): void {
    if (this.messagesContainer && this.messagesContainer.nativeElement) {
      const container = this.messagesContainer.nativeElement;
      setTimeout(() => {
        if (this.ticketMessages.length > this.MAX_VISIBLE_MESSAGES) {
          const scrollPosition = Math.max(0, container.scrollHeight * 0.7);
          container.scrollTop = scrollPosition;
        } else {
          container.scrollTop = container.scrollHeight;
        }
      }, 100);
    }
  }

  loadCategoryService() {
    if (!this.ticket) return;

    this.ticketCategoriesService
      .getTicketCategoryById(this.ticket.ticketCategoryId)
      .subscribe({
        next: (category) => {
          this.ticketCategory = category.description;
        },
        error: (err) => {
          console.error('Error fetching ticket category:', err);
        },
      });
  }

  loadTicketImages() {
    if (!this.ticket) return;

    this.ticketService.getTicketImagesById(this.ticket.ticketId).subscribe({
      next: (images: Blob[]) => {
        this.ticketImages = images.map((img) => URL.createObjectURL(img));
      },
      error: (err) => {
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
      const messageData = {
        ticketId: this.ticket.ticketId,
        senderId: this.authService.getUserFromToken().userId,
        message: this.messageForm.value.message,
        timestamp: new Date().toISOString(),
      };

      const optimisticMessage: Message = {
        messageId: -1,
        ticketId: messageData.ticketId,
        senderId: messageData.senderId,
        message: messageData.message!,
        timestamp: messageData.timestamp,
        wasEdited: false,
      };

      this.ticketMessages.push(optimisticMessage);
      const tempTimestamp = messageData.timestamp;
      this.messageForm.reset();
      this.shouldScrollToBottom = true;
      this.isLoadingMessages = false;
      this.cdr.detectChanges();

      this.commentService.save(messageData).subscribe({
        next: (savedMessage) => {
          const index = this.ticketMessages.findIndex(
            (m) => m.messageId === -1 && m.timestamp === tempTimestamp
          );
          if (index !== -1) {
            this.ticketMessages[index] = savedMessage;
          }
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error sending message:', err);
          const index = this.ticketMessages.findIndex(
            (m) => m.messageId === -1 && m.timestamp === tempTimestamp
          );
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
