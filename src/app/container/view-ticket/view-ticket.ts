import { DatePipe, Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
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
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatToolbarModule,
    MatBadgeModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './view-ticket.html',
  styleUrl: './view-ticket.scss',
})
export class ViewTicket {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private ticketService = inject(TicketService);
  private ticketCategoriesService = inject(TicketCategoriesService);
  private commentService = inject(CommentService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  ticket: Ticket | null = null;
  ticketCategory: string | null = null;
  ticketImages: string[] | null = null;
  ticketMessages: Message[] = [];

  messageForm = this.fb.group({
    message: ['', [Validators.required]],
  });

  ngOnInit() {
    this.ticket = this.route.snapshot.data['ticket'];
    console.log(this.ticket);

    this.loadCategoryService();
    this.loadTicketImages();
    this.loadMessages();
  }

  loadMessages() {
    if (!this.ticket) return;

    this.commentService.loadById(this.ticket.ticketId).subscribe({
      next: (comments) => {
        this.ticketMessages = comments;
      },
      error: (err) => {
        console.error('Error fetching ticket comments:', err);
      },
    });
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
      next: (images: Blob[] | Blob) => {
        if (Array.isArray(images)) {
          this.ticketImages = images.map((img) => URL.createObjectURL(img));
        } else if (images instanceof Blob) {
          this.ticketImages = [URL.createObjectURL(images)];
        } else {
          this.ticketImages = [];
        }
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
      this.commentService
        .save({
          ticketId: this.ticket.ticketId,
          senderId: this.authService.getUserFromToken().userId,
          message: this.messageForm.value.message,
          timestamp: new Date().toISOString(),
        })
        .subscribe({
          next: (message) => {
            this.ticketMessages.push(message);
            this.messageForm.reset();
          },
          error: (err) => {
            console.error('Error sending message:', err);
          },
        });
    }
  }
}
