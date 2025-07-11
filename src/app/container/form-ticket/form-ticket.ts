import { MatSelectModule } from '@angular/material/select';
import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
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
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormUtilsService } from '../../shared/form/form-utils';
import { TicketService } from '../../services/tickets/ticket-service.js';
import { ImageUpload } from "../../components/image-upload/image-upload";
import { forkJoin, map } from 'rxjs';

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

  selectedFiles = signal<File[]>([]);
  existingImageUrls = signal<string[]>([]);
  removedImagePaths = signal<string[]>([]);

  private formBuilder = inject(FormBuilder);
  private ticketService = inject(TicketService);
  private snackBar = inject(MatSnackBar);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  ticketId: number | null = null;

  formUtils = inject(FormUtilsService);

  ngOnInit() {
    this.ticketId = this.route.snapshot.params['id'] || null;

    this.form = this.formBuilder.group({
      description: ['', [Validators.required, Validators.minLength(3)]],
      ticketCategoryId: ['', [Validators.required]],
      ticketStatus: ['PENDING'],
      images: [null]
    });

    this.loadCategories();
    if (this.ticketId) {
      this.loadTicket(this.ticketId);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const ticketJson = {
        ticketCategoryId: this.form.get('ticketCategoryId')?.value,
        description: this.form.get('description')?.value,
        ticketStatus: this.form.get('ticketStatus')?.value,
      };

      const formData = new FormData();
      formData.append('ticket', new Blob([JSON.stringify(ticketJson)], { type: 'application/json' }));

      this.selectedFiles().forEach(file => { formData.append('images', file); });

      const request$ = this.ticketId
        ? this.ticketService.update(this.ticketId, formData)
        : this.ticketService.save(formData);

      request$.subscribe({
        next: () => {
          this.snackBar.open(
            this.ticketId ? 'Ticket atualizado com sucesso!' : 'Ticket criado com sucesso!',
            'Fechar',
            { duration: 3000, panelClass: ['snackbar-success'] }
          );
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open('Erro ao salvar o ticket.', 'Fechar', {
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

  loadTicket(id: number) {
    this.ticketService.getTicketById(id).subscribe({
      next: (ticket) => {
        this.form.patchValue({
          description: ticket.description,
          ticketCategoryId: ticket.ticketCategoryId,
          ticketStatus: ticket.ticketStatus
        });

        if (ticket.imagesAttachedPaths?.length) {
          const imageBlobObservables = ticket.imagesAttachedPaths.map((filename: string) =>
            this.ticketService.getTicketImage(filename).pipe(
              map(blob => URL.createObjectURL(blob))
            )
          );

          forkJoin<string[]>(imageBlobObservables).subscribe((urls: string[]) => {
            this.existingImageUrls.set(urls);
          });
        }
      }
    });
  }
}
