import { TestBed } from '@angular/core/testing';

import { RiskScoringService } from './risk-scoring-service';

describe('RiskScoringService', () => {
  let service: RiskScoringService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RiskScoringService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
