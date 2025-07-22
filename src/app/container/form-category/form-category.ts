import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormUtilsService } from '../../shared/form/form-utils';
import { TicketCategoriesService } from '../../services/ticket-categories/ticket-categories-service';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Location } from '@angular/common';

@Component({
  selector: 'app-form-category',
  imports: [
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './form-category.html',
  styleUrl: './form-category.scss'
})
export class FormCategory {

  form!: FormGroup;

  private ticketCategoriesService = inject(TicketCategoriesService);
  private formBuilder = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);

  categoryId: number | null = null;
  loading = signal(false);
  formUtils = inject(FormUtilsService);

  get isCreatingCategory(): boolean {
    return this.categoryId === null;
  }

  ngOnInit() {
    this.buildForm();
    this.categoryId = this.route.snapshot.params['id']
      ? parseInt(this.route.snapshot.params['id'])
      : null;

    if (this.categoryId) {
      this.loadCategory();
    }
  }

  buildForm() {
    this.form = this.formBuilder.group({
      description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]]
    });
  }

  loadCategory() {
    if (!this.categoryId) return;

    this.loading.set(true);
    this.ticketCategoriesService.getTicketCategoryById(this.categoryId).subscribe({
      next: (category) => {
        this.form.patchValue({
          description: category.description
        });
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar categoria:', err);
        this.snackBar.open('Erro ao carregar categoria.', 'Fechar', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });
        this.loading.set(false);
      }
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading.set(true);
      const categoryData = {
        description: this.form.get('description')?.value,
        isActive: true
      };

      const request$ = this.categoryId
        ? this.ticketCategoriesService.update(this.categoryId, categoryData)
        : this.ticketCategoriesService.save(categoryData);

      request$.subscribe({
        next: () => {
          this.snackBar.open(
            this.categoryId ? 'Categoria atualizada com sucesso!' : 'Categoria criada com sucesso!',
            'Fechar',
            { duration: 3000, panelClass: ['snackbar-success'] }
          );
          this.router.navigate(['/categories']);
          this.loading.set(false);
        },
        error: (err: any) => {
          console.error(err);
          this.snackBar.open('Erro ao salvar a categoria.', 'Fechar', {
            duration: 3000,
            panelClass: ['snackbar-error'],
          });
          this.loading.set(false);
        },
      });
    }
  }

  goBack() {
    this.location.back();
  }
}
