import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TicketResponse } from '../../model/ticket';
import { UsersService } from '../../services/users-service';

@Component({
  selector: 'app-tickets',
  imports: [
    CommonModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatDividerModule,
    MatListModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule
  ],
  templateUrl: './tickets.html',
  styleUrl: './tickets.scss',
  imports: [],
})
export class Tickets {
  openTask(ticket: TicketResponse ) {
    // This method is intended to handle the opening of a task.
    // Currently, it does not implement any functionality.
    throw new Error('Method not implemented.');
  }

  readonly panelOpenState = signal(false);

  // Inject UsersService
  constructor(private usersService: UsersService) {}

  // Get logged user from service
  get user() {
    return this.usersService.getLoggedUser();
  }

  tasks = [
    {
      title: '#BoraCodar um Kanban 🚀',
      description: 'Novo desafio da Rocketseat. Bora codar!',
      tags: ['Estudo', 'Frontend'],
      status: 'open'
    },
    {
      title: 'Conferir o novo desafio 🔥',
      description: 'Conferir o novo projeto do #BoraCodar que está sensacional.',
      tags: ['Estudo', 'Design'],
      status: 'in-progress'
    },
    {
      title: '#BoraCodar uma página de login 🙌',
      description: 'Novo desafio de UI para praticar CSS moderno.',
      tags: ['Frontend', 'UI'],
      status: 'open'
    },
    {
      title: 'Mostrar o reflow ⚡',
      description: 'Melhore sua produtividade utilizando boas práticas de performance.',
      tags: ['Estudo', 'Performance'],
    },
    {
      title: 'Ser incrível 💪',
      description: 'Supere-se todos os dias! Você é capaz!',
      tags: ['Motivação'],
    },
    {
      title: '#BoraCodar uma página de clima ☁️',
      description: 'Explore APIs abertas com dados de clima.',
      tags: ['API', 'Frontend'],
    },
    {
      title: 'Almoçar 🍜',
      description: 'Hora de dar uma pausa e recarregar.',
      tags: ['Pessoal'],
    },
    {
      title: '#BoraCodar um conversor 💱',
      description: 'Desafio prático com valores e moedas!',
      tags: ['Estudo', 'Lógica'],
    },
  ];
}