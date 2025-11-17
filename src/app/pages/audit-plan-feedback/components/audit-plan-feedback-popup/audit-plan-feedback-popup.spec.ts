import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditPlanFeedbackPopup } from './audit-plan-feedback-popup';

describe('AuditPlanFeedbackPopup', () => {
  let component: AuditPlanFeedbackPopup;
  let fixture: ComponentFixture<AuditPlanFeedbackPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditPlanFeedbackPopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditPlanFeedbackPopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
