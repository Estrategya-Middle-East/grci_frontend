import { TestBed } from '@angular/core/testing';

import { AuditItemService } from './audit-item-service';

describe('AuditItemService', () => {
  let service: AuditItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuditItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
