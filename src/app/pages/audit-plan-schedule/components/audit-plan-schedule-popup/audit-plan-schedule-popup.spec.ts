import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditPlanSchedulePopup } from './audit-plan-schedule-popup';

describe('AuditPlanSchedulePopup', () => {
  let component: AuditPlanSchedulePopup;
  let fixture: ComponentFixture<AuditPlanSchedulePopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditPlanSchedulePopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditPlanSchedulePopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
