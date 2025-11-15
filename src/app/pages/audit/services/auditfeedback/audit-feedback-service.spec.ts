import { TestBed } from '@angular/core/testing';

import { AuditFeedbackService } from './audit-feedback-service';

describe('AuditFeedbackService', () => {
  let service: AuditFeedbackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditFeedbackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
