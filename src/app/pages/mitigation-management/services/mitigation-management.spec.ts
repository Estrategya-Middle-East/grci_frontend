import { TestBed } from '@angular/core/testing';

import { MitigationManagement } from './mitigation-management';

describe('MitigationManagement', () => {
  let service: MitigationManagement;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MitigationManagement);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
