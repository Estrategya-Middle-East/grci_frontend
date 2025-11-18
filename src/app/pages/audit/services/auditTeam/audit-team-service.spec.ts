import { TestBed } from '@angular/core/testing';

import { AuditTeamService } from './audit-team-service';

describe('AuditTeamService', () => {
  let service: AuditTeamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditTeamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
