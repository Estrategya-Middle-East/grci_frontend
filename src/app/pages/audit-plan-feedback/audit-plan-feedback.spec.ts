import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditPlanFeedback } from './audit-plan-feedback';

describe('AuditPlanFeedback', () => {
  let component: AuditPlanFeedback;
  let fixture: ComponentFixture<AuditPlanFeedback>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditPlanFeedback]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditPlanFeedback);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
