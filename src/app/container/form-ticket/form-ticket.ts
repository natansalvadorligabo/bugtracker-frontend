import { MatSelectModule } from '@angular/material/select';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { FormUtilsService } from '../../shared/form/form-utils';
import { TicketService } from '../../services/ticket-service.js';
import { ImageUpload } from "../../components/image-upload/image-upload";

@Component({
  selector: 'app-form-ticket',
  imports: [
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatCheckboxModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule,
    ImageUpload
],
  templateUrl: './form-ticket.html',
  styleUrl: './form-ticket.scss'
})
export class FormTicket {

  form!: FormGroup;

  categories: any[] = [];
  selectedCategoryId: number | null = null;

  selectedFiles: File[] = [];

  private formBuilder = inject(FormBuilder);
  private ticketService = inject(TicketService);
  private snackBar = inject(MatSnackBar);
  formUtils = inject(FormUtilsService);

  ngOnInit() {
    this.form = this.formBuilder.group({
      description: ['', [Validators.required, Validators.minLength(3)]],
      ticketCategoryId: [null, [Validators.required]],
      ticketStatus: ['PENDING'],
      images: [null]
    });

    this.loadCategories();
  }

  onCategorySelected(value: number) {
    this.form.get('ticketCategoryId')?.setValue(value);
  }

  onSubmit() {
    if (this.form.valid) {
      const ticketJson = {
        ticketCategoryId: this.form.get('ticketCategoryId')?.value,
        description: this.form.get('description')?.value,
        ticketStatus: this.form.get('ticketStatus')?.value,
        imagesAttachedPaths: []
      };

      const formData = new FormData();
      formData.append('ticket', new Blob([JSON.stringify(ticketJson)], { type: 'application/json' }));

      this.selectedFiles.forEach(file => {
        formData.append('images', file);
      });

      this.ticketService.save(formData).subscribe({
        next: () => {
          this.snackBar.open('Ticket criado com sucesso!', 'Fechar', {
            duration: 3000,
            panelClass: ['snackbar-success'],
          });
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open('Erro ao criar o ticket.', 'Fechar', {
            duration: 3000,
            panelClass: ['snackbar-error'],
          });
        },
      });
    } else {
      this.formUtils.validateAllFormFields(this.form);
    }
  }

  loadCategories() {
    this.ticketService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => {
        console.error('Erro ao carregar categorias', err);
        this.snackBar.open('Erro ao carregar categorias', 'Fechar', { duration: 3000 });
      }
    });
  }
}
