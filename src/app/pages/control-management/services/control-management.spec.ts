import { TestBed } from '@angular/core/testing';

import { ControlManagement } from './control-management';

describe('ControlManagement', () => {
  let service: ControlManagement;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControlManagement);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
