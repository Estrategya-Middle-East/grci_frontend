import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveDaysPopup } from './leave-days-popup';

describe('LeaveDaysPopup', () => {
  let component: LeaveDaysPopup;
  let fixture: ComponentFixture<LeaveDaysPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveDaysPopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveDaysPopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
