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
    MatSnackBarModule
  ],
  templateUrl: './form-ticket.html',
  styleUrl: './form-ticket.scss'
})
export class FormTicket {

  form!: FormGroup;

  categories: any[] = [];

  selectedFiles: File[] = [];

  private formBuilder = inject(FormBuilder);
  private ticketService = inject(TicketService);
  private snackBar = inject(MatSnackBar);
  formUtils = inject(FormUtilsService);

  ngOnInit() {
    this.form = this.formBuilder.group({
      description: ['', [Validators.required, Validators.minLength(3)]],
      ticketCategoryId: ['', [Validators.required, Validators.minLength(3)]],
      ticketStatus: ['PENDING'],
      images: [null]
    });

    this.loadCategories();
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    this.selectedFiles = Array.from(files);
  }

  onSubmit() {
    if (this.form.valid) {
      this.ticketService.save(this.form.value).subscribe({
        next: (data) => {
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
    // recuperar no endpoint
    this.categories = [
      { ticket_category_id: 14, description: 'Bug', is_active: true },
      { ticket_category_id: 15, description: 'Feature Request', is_active: true },
      { ticket_category_id: 16, description: 'Suporte', is_active: true },
    ];
  }
}
