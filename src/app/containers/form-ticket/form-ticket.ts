import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }     from '@angular/material/input';
import { MatSelectModule }    from '@angular/material/select';
import { MatButtonModule }    from '@angular/material/button';
import { MatCardModule }      from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { TicketStatus } from '../../models/ticket-status.js';
import { TicketCategory } from '../../models/ticket-category.js';

@Component({
  selector: 'app-form-ticket',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule
  ],
  templateUrl: './form-ticket.html',
  styleUrls: ['./form-ticket.scss']
})
export class FormTicket implements OnInit {
  ticketForm!: FormGroup;
  ticketId: string | null = null;
  modoEdicao = false;

  categorias: TicketCategory[] = [];
  statuses: TicketStatus[]     = [];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    // private ticketService: TicketService  // descomente quando tiver o service
  ) {}

  ngOnInit(): void {
    this.ticketId    = this.route.snapshot.paramMap.get('id');
    this.modoEdicao  = !!this.ticketId;

    this.ticketForm = this.fb.group({
      description       : ['', [Validators.required, Validators.minLength(10)]],
      ticketCategoryId  : [null, [Validators.required]],
      ticketStatus      : [null, [Validators.required]]
    });

    this.loadCategorias();
    this.statuses = Object.values(TicketStatus);

    if (this.modoEdicao) {
      // this.ticketService.getById(this.ticketId!).subscribe(ticket => {
      //   this.ticketForm.patchValue(ticket);
      // });
      const mock = {
        description      : 'Erro ao conectar no banco',
        ticketCategoryId : 2,
        ticketStatus     : TicketStatus.PENDING
      };
      this.ticketForm.patchValue(mock);
    }
  }

  private loadCategorias() {
    // this.ticketService.getCategories().subscribe(list => this.categorias = list);
    this.categorias = [
      { ticketCategoryId: 1, description: 'Infra', isActive: true },
      { ticketCategoryId: 2, description: 'Banco de Dados', isActive: true },
      { ticketCategoryId: 3, description: 'UI/UX', isActive: false }
    ].filter(cat => cat.isActive);
  }

  get description()      { return this.ticketForm.get('description'); }
  get ticketCategoryId() { return this.ticketForm.get('ticketCategoryId'); }
  get ticketStatus()     { return this.ticketForm.get('ticketStatus'); }

  onSubmit(): void {
    if (this.ticketForm.invalid) return;

    const payload = this.ticketForm.value;
    if (this.modoEdicao) {
      // this.ticketService.update(this.ticketId!, payload).subscribe(() => {
        this.snackBar.open('Ticket atualizado com sucesso!', 'Fechar', { duration: 3000 });
      // });
    } else {
      // this.ticketService.create(payload).subscribe(() => {
        this.snackBar.open('Ticket criado com sucesso!', 'Fechar', { duration: 3000 });
        this.ticketForm.reset();
      // });
    }
  }
}
