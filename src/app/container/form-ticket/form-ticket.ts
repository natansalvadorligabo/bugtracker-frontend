import { MatSelectModule } from '@angular/material/select';
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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormUtilsService } from '../../shared/form/form-utils';
import { TicketService } from '../../services/tickets/ticket-service.js';
import { TicketCategoriesService } from '../../services/ticket-categories/ticket-categories-service';
import { ImageUpload } from "../../components/image-upload/image-upload";
import { forkJoin, map } from 'rxjs';
import { AuthService } from '../../services/auth/auth-service.js';
import { UsersService } from '../../services/users/users-service';
import { User } from '../../model/user';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Location } from '@angular/common';

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
    ImageUpload,
    MatProgressSpinnerModule
],
  templateUrl: './form-ticket.html',
  styleUrl: './form-ticket.scss'
})
export class FormTicket {

  form!: FormGroup;

  categories: any[] = [];
  selectedCategoryId: number | null = null;
  technicians: User[] = [];

  selectedFiles = signal<File[]>([]);
  existingImageUrls = signal<string[]>([]);
  removedImagePaths = signal<string[]>([]);

  private ticketService = inject(TicketService);
  private ticketCategoriesService = inject(TicketCategoriesService);
  private authService = inject(AuthService);
  private usersService = inject(UsersService);

  private location = inject(Location);

  private formBuilder = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ticketId: number | null = null;

  loading = signal(false);

  formUtils = inject(FormUtilsService);

  get isUser(): boolean {
    return this.authService.isUser;
  }

  get isTechnician(): boolean {
    return this.authService.isTechnician;
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin;
  }

  get isCreatingTicket(): boolean {
    return this.ticketId === null;
  }

  get canCreateTicket(): boolean {
    return (this.isUser || this.isAdmin) && this.isCreatingTicket;
  }

  get canEditTitle(): boolean {
    return this.canCreateTicket || this.isAdmin || this.isUser;
  }

  get canEditDescription(): boolean {
    return this.canCreateTicket || this.isAdmin || this.isUser;
  }

  get canEditCategory(): boolean {
    return this.canCreateTicket || this.isAdmin;
  }

  get canEditAttachments(): boolean {
    return false;
  }

  get canEditStatus(): boolean {
    return (this.isTechnician || this.isAdmin) && !this.isCreatingTicket;
  }

  get canEditAssigned(): boolean {
    return (this.isTechnician || this.isAdmin) && !this.isCreatingTicket;
  }

  get showStatusField(): boolean {
    return !this.isCreatingTicket;
  }

  get showAssignedField(): boolean {
    return !this.isCreatingTicket;
  }

  ngOnInit() {
    this.ticketId = this.route.snapshot.params['id'] || null;

    this.form = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      ticketCategoryId: ['', [Validators.required]],
      ticketStatus: ['PENDING'],
      receiverId: [null],
      images: [null]
    });

    this.updateFormPermissions();

    this.loadCategories();

    this.loadTechnicians(() => {
      if (this.ticketId) {
        this.loadTicket(this.ticketId);
      }
    });
  }

  onSubmit() {
    if (this.isCreatingTicket && !this.canCreateTicket) {
      this.snackBar.open('Você não tem permissão para criar tickets.', 'Fechar', {
        duration: 3000,
        panelClass: ['snackbar-error'],
      });
      return;
    }

    if (this.form.valid) {
      this.loading.set(true);
      const ticketJson = {
        title: this.form.get('title')?.value,
        description: this.form.get('description')?.value,
        ticketCategoryId: this.form.get('ticketCategoryId')?.value,
        ticketStatus: this.form.get('ticketStatus')?.value,
        receiverId: this.form.get('receiverId')?.value || null,
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

          if (!this.ticketId) {
            this.router.navigate(['/tickets']);
          }
          this.loading.set(false);
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open('Erro ao salvar o ticket.', 'Fechar', {
            duration: 3000,
            panelClass: ['snackbar-error'],
          });
          this.loading.set(false);
        },
      });
    } else {
      this.formUtils.validateAllFormFields(this.form);
    }
  }

  loadCategories() {
    this.ticketCategoriesService.getTicketCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Erro ao carregar categorias', err);
        this.snackBar.open('Erro ao carregar categorias', 'Fechar', { duration: 3000 });
      }
    });
  }

  loadTechnicians(callback?: () => void) {
    this.usersService.getTechnicians().subscribe({
      next: (technicians) => {
        this.technicians = technicians || [];

        if (callback) {
          callback();
        }
      },
      error: (err) => {
        console.error('Erro ao carregar técnicos', err);
        this.snackBar.open('Erro ao carregar técnicos', 'Fechar', { duration: 3000 });
        this.technicians = [];
      }
    });
  }

  loadTicket(id: number) {
    this.ticketService.getTicketById(id).subscribe({
      next: (ticket) => {
        this.form.patchValue({
          title: ticket.title,
          description: ticket.description,
          ticketCategoryId: ticket.ticketCategoryId,
          ticketStatus: ticket.ticketStatus,
          receiverId: ticket.receiver?.userId || null
        });


        this.updateFormPermissions();

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

  updateFormPermissions() {
    if (!this.canEditTitle) {
      this.form.get('title')?.disable();
    } else {
      this.form.get('title')?.enable();
    }

    if (!this.canEditDescription) {
      this.form.get('description')?.disable();
    } else {
      this.form.get('description')?.enable();
    }

    if (!this.canEditCategory) {
      this.form.get('ticketCategoryId')?.disable();
    } else {
      this.form.get('ticketCategoryId')?.enable();
    }

    if (!this.canEditStatus) {
      this.form.get('ticketStatus')?.disable();
    } else {
      this.form.get('ticketStatus')?.enable();
    }

    if (!this.canEditAssigned) {
      this.form.get('receiverId')?.disable();
    } else {
      this.form.get('receiverId')?.enable();
    }
  }

  goBack() {
    this.location.back();
  }
}
