import { TestBed } from '@angular/core/testing';

import { TicketCategoriesService } from './ticket-categories-service';

describe('TicketCategoriesService', () => {
  let service: TicketCategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketCategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
