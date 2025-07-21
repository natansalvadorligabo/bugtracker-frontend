import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { Ticket } from '../../model/ticket';
import { TicketCategory } from '../../model/ticket-categories';
import { TicketCategoriesService } from '../../services/ticket-categories/ticket-categories-service';
import { TicketService } from '../../services/tickets/ticket-service';
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
    MatExpansionModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './tickets.html',
  styleUrl: './tickets.scss',
})
export class Tickets implements OnInit, OnDestroy {
  private ticketService = inject(TicketService);
  private ticketCategoriesService = inject(TicketCategoriesService);
  private userService = inject(UsersService);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ticketCategoriesSubscription: any;
  ticketsSubscription: any;

  user: any;

  searchTerm = '';
  selectedTags: TicketCategory[] = [];
  selectedStatuses: string[] = [];
  showOnlyMyTickets = true;
  allTickets: Ticket[] = [];
  availableTagsList: TicketCategory[] = [];

  isLoading = true;

  availableStatuses = [
    { value: 'PENDING', label: 'Pendente', color: 'text-yellow-500' },
    { value: 'ATTACHED', label: 'Atribuído', color: 'text-orange-500' },
    { value: 'STOPPED', label: 'Pausado', color: 'text-red-500' },
    { value: 'COMPLETED', label: 'Completo', color: 'text-green-500' },
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

    if (this.showOnlyMyTickets && this.user && this.user.userId) {
      filteredTickets = filteredTickets.filter(
        (ticket) => ticket.senderId === this.user.userId
      );
    }

    if (this.searchTerm) {
      filteredTickets = filteredTickets.filter(
        (ticket) =>
          ticket.title &&
          ticket.title.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.selectedTags.length > 0) {
      filteredTickets = filteredTickets.filter((ticket) =>
        this.selectedTags.some(
          (selectedTag) =>
            ticket.ticketCategoryId === selectedTag.ticketCategoryId
        )
      );
    }

    if (this.selectedStatuses.length > 0) {
      filteredTickets = filteredTickets.filter((ticket) =>
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
        console.log('erro ao carregar perfil do usuário: ', error);
      },
    });
  }

  private loadTickets(): void {
    this.isLoading = true;
    this.ticketsSubscription = this.ticketService.getTickets().subscribe({
      next: (tickets) => {
        this.allTickets = tickets;
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        console.log('Erro ao carregar tickets:', error);
        this.isLoading = false;
      },
    });
  }

  private loadCategories(): void {
    this.ticketCategoriesSubscription = this.ticketCategoriesService
      .getTicketCategories()
      .subscribe({
        next: (categories) => {
          this.availableTagsList = categories.filter(
            (category) => category.isActive
          );
          this.changeDetectorRef.detectChanges();
        },
        error: (error) => {
          console.log('Erro ao carregar categorias:', error);
        },
      });
  }

  getTagsForticket(ticket: Ticket): TicketCategory[] {
    return this.availableTags.filter(
      (tag) => ticket.ticketCategoryId === tag.ticketCategoryId
    );
  }

  getStatusInfo(status: string) {
    return (
      this.availableStatuses.find((s) => s.value === status) || {
        value: status,
        label: status,
        color: 'text-gray-500',
      }
    );
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

  toggleTicketView() {
    this.showOnlyMyTickets = !this.showOnlyMyTickets;
    this.clearFilters();
  }

  get currentViewLabel(): string {
    return this.showOnlyMyTickets ? 'Meus tickets' : 'Todos os tickets';
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

  viewTicket(ticketId: number) {
    this.router.navigate([ticketId], { relativeTo: this.route });
  }
}
