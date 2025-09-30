import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveDays } from './leave-days';

describe('LeaveDays', () => {
  let component: LeaveDays;
  let fixture: ComponentFixture<LeaveDays>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveDays]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveDays);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
