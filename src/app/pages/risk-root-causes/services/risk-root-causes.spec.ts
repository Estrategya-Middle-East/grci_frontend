import { TestBed } from '@angular/core/testing';

import { RiskRootCauses } from './risk-root-causes';

describe('RiskRootCauses', () => {
  let service: RiskRootCauses;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiskRootCauses);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
