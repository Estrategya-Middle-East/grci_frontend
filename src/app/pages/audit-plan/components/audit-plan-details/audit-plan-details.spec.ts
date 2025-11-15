import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditPlanDetails } from './audit-plan-details';

describe('AuditPlanDetails', () => {
  let component: AuditPlanDetails;
  let fixture: ComponentFixture<AuditPlanDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditPlanDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditPlanDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
