import { TestBed } from '@angular/core/testing';

import { TestingNatureService } from './testing-nature-service';

describe('TestingNatureService', () => {
  let service: TestingNatureService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestingNatureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
