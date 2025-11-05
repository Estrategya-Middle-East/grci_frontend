import { TestBed } from '@angular/core/testing';

import { ResourcesFunctions } from './resources-functions';

describe('ResourcesFunctions', () => {
  let service: ResourcesFunctions;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResourcesFunctions);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
