import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { catchError, EMPTY, Observable } from 'rxjs';
import { Ticket } from '../../model/ticket';
import { TicketService } from './ticket-service';

export const ticketResolver: ResolveFn<Ticket> = (route: ActivatedRouteSnapshot): Observable<Ticket> => {
  const ticketService = inject(TicketService);
  const router = inject(Router);
  const ticketId = Number(route.paramMap.get('id'));

  if (!ticketId) {
    router.navigate(['/tickets']);
    return EMPTY;
  }

  return ticketService.getTicketById(ticketId).pipe(
    catchError(() => {
      router.navigate(['/tickets']);
      return EMPTY;
    })
  );
};
