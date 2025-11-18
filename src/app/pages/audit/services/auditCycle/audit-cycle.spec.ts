import { TestBed } from '@angular/core/testing';

import { AuditCycle } from './audit-cycle';

describe('AuditCycle', () => {
  let service: AuditCycle;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditCycle);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
