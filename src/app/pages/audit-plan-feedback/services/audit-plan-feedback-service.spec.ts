import { TestBed } from '@angular/core/testing';

import { AuditPlanFeedbackService } from './audit-plan-feedback-service';

describe('AuditPlanFeedbackService', () => {
  let service: AuditPlanFeedbackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditPlanFeedbackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
