import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditPlanMemorandumDetails } from './audit-plan-memorandum-details';

describe('AuditPlanMemorandumDetails', () => {
  let component: AuditPlanMemorandumDetails;
  let fixture: ComponentFixture<AuditPlanMemorandumDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditPlanMemorandumDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditPlanMemorandumDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
