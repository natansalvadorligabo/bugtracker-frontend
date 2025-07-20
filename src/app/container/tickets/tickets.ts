import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { TicketService } from '../../services/tickets/ticket-service';
import { Ticket } from '../../model/ticket';
import { TicketCategoriesService } from '../../services/ticket-categories/ticket-categories-service';
import { TicketCategory } from '../../model/ticket-categories';
import { UsersService } from '../../services/users/users-service';

@Component({
  selector: 'app-tickets',
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule
  ],
  templateUrl: './tickets.html',
  styleUrl: './tickets.scss'
})
export class Tickets implements OnInit, OnDestroy {

  private ticketsService = inject(TicketService);
  private ticketCategoriesService = inject(TicketCategoriesService);
  private userService = inject(UsersService);
  private cdr = inject(ChangeDetectorRef);

  ticketCategoriesSubscription: any;
  ticketsSubscription: any;

  user: any;

  searchTerm = '';
  selectedTags: TicketCategory[] = [];
  selectedStatuses: string[] = [];
  allTickets: Ticket[] = [];
  availableTagsList: TicketCategory[] = [];

  availableStatuses = [
    { value: 'PENDING', label: 'Pendente', color: 'text-yellow-500' },
    { value: 'ATTACHED', label: 'Atribuído', color: 'text-orange-500' },
    { value: 'STOPPED', label: 'Pausado', color: 'text-red-500' },
    { value: 'COMPLETED', label: 'Completo', color: 'text-green-500' }
  ];

  ngOnInit() {
    this.loadUserProfile();
    this.loadCategories();
  }

  ngOnDestroy() {
    if (this.ticketsSubscription) {
      this.ticketsSubscription.unsubscribe();
    }
    if (this.ticketCategoriesSubscription) {
      this.ticketCategoriesSubscription.unsubscribe();
    }
  }

  get tickets() {
    let filteredTickets = this.allTickets;

    if (this.searchTerm) {
      filteredTickets = filteredTickets.filter(ticket =>
        ticket.title && ticket.title.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.selectedTags.length > 0) {
      filteredTickets = filteredTickets.filter(ticket =>
        this.selectedTags.some(selectedTag =>
          ticket.ticketCategoryId === selectedTag.ticketCategoryId
        )
      );
    }

    if (this.selectedStatuses.length > 0) {
      filteredTickets = filteredTickets.filter(ticket =>
        this.selectedStatuses.includes(ticket.ticketStatus)
      );
    }

    return filteredTickets;
  }

  get availableTags() {
    return this.availableTagsList;
  }

  get isSearching() {
    return this.searchTerm.trim().length > 0;
  }

  get isFiltering() {
    return this.selectedTags.length > 0 || this.selectedStatuses.length > 0;
  }

  get hasNoResults() {
    return this.tickets.length === 0;
  }

  private loadUserProfile(): void {
    this.userService.getUserProfile().subscribe({
      next: (user) => {
        this.user = user;
        this.loadTickets();
      },
      error: (error) => {
        console.log('erro ao carregar perfil do usuário: ', error)
      },
    });
  }

  private loadTickets(): void {
    this.ticketsSubscription = this.ticketsService.getTickets().subscribe({
      next: (tickets) => {
        if (this.user && this.user.userId) {
          this.allTickets = tickets.filter(ticket =>
            ticket.senderId === this.user!.userId
          );
        } else {
          this.allTickets = tickets;
        }

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.log('Erro ao carregar tickets:', error);
      }
    });
  }

  private loadCategories(): void {
    this.ticketCategoriesSubscription = this.ticketCategoriesService.getTicketCategories().subscribe({
      next: (categories) => {
        this.availableTagsList = categories.filter(category => category.isActive);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.log('Erro ao carregar categorias:', error);
      }
    });
  }

  getTagsForticket(ticket: Ticket): TicketCategory[] {
    return this.availableTags.filter(tag =>
      ticket.ticketCategoryId === tag.ticketCategoryId
    );
  }

  getStatusInfo(status: string) {
    return this.availableStatuses.find(s => s.value === status) ||
           { value: status, label: status, color: 'text-gray-500' };
  }

  toggleTag(category: TicketCategory) {
    const index = this.selectedTags.indexOf(category);
    if (index > -1) {
      this.selectedTags.splice(index, 1);
    } else {
      this.selectedTags.push(category);
    }
  }

  toggleStatus(status: string) {
    const index = this.selectedStatuses.indexOf(status);
    if (index > -1) {
      this.selectedStatuses.splice(index, 1);
    } else {
      this.selectedStatuses.push(status);
    }
  }

  isTagSelected(category: TicketCategory): boolean {
    return this.selectedTags.includes(category);
  }

  isStatusSelected(status: string): boolean {
    return this.selectedStatuses.includes(status);
  }

  clearSearch() {
    this.searchTerm = '';
  }

  clearTags() {
    this.selectedTags = [];
  }

  clearStatuses() {
    this.selectedStatuses = [];
  }

  clearFilters() {
    this.selectedTags = [];
    this.selectedStatuses = [];
    this.searchTerm = '';
  }
}
