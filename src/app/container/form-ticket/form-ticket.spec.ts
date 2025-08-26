import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTicket } from './form-ticket';

describe('FormTicket', () => {
  let component: FormTicket;
  let fixture: ComponentFixture<FormTicket>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormTicket]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormTicket);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
