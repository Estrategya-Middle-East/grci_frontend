import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditPlanSchedule } from './audit-plan-schedule';

describe('AuditPlanSchedule', () => {
  let component: AuditPlanSchedule;
  let fixture: ComponentFixture<AuditPlanSchedule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditPlanSchedule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditPlanSchedule);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
