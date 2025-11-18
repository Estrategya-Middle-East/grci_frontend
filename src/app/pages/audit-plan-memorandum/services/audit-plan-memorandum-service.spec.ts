import { TestBed } from '@angular/core/testing';

import { AuditPlanMemorandumService } from './audit-plan-memorandum-service';

describe('AuditPlanMemorandumService', () => {
  let service: AuditPlanMemorandumService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditPlanMemorandumService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
