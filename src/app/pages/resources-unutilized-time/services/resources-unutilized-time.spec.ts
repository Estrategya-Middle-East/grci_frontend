import { TestBed } from '@angular/core/testing';

import { ResourcesUnutilizedTime } from './resources-unutilized-time';

describe('ResourcesUnutilizedTime', () => {
  let service: ResourcesUnutilizedTime;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResourcesUnutilizedTime);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
