import { TestBed } from '@angular/core/testing';

import { ResourcesPerformanceService } from './resources-performance-service';

describe('ResourcesPerformanceService', () => {
  let service: ResourcesPerformanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResourcesPerformanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
