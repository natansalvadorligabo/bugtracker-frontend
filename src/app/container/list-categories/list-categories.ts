import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { TicketCategory } from '../../model/ticket-categories';
import { TicketCategoriesService } from '../../services/ticket-categories/ticket-categories-service';
import { AuthService } from '../../services/auth/auth-service';

@Component({
  selector: 'app-list-categories',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './list-categories.html',
  styleUrl: './list-categories.scss'
})
export class ListCategories implements OnInit {

  private ticketCategoriesService = inject(TicketCategoriesService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  categories: TicketCategory[] = [];
  isLoading = true;
  displayedColumns: string[] = ['description', 'actions'];

  get isAdmin(): boolean {
    return this.authService.isAdmin;
  }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.isLoading = true;
    this.ticketCategoriesService.getTicketCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar categorias:', err);
        this.snackBar.open('Erro ao carregar categorias.', 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });
        this.isLoading = false;
      }
    });
  }

  createCategory() {
    this.router.navigate(['/categories/new']);
  }

  editCategory(categoryId: number) {
    this.router.navigate(['/categories/edit', categoryId]);
  }

  deleteCategory(category: TicketCategory) {
    if (confirm(`Tem certeza que deseja excluir a categoria "${category.description}"?`)) {
      this.ticketCategoriesService.remove(category.ticketCategoryId).subscribe({
        next: () => {
          this.snackBar.open('Categoria excluída com sucesso!', 'Fechar', {
            duration: 3000,
            panelClass: ['snackbar-success'],
          });
          this.loadCategories();
        },
        error: (err: any) => {
          console.error('Erro ao excluir categoria:', err);
          this.snackBar.open('Erro ao excluir categoria.', 'Fechar', {
            duration: 3000,
            panelClass: ['snackbar-error'],
          });
        }
      });
    }
  }
}
