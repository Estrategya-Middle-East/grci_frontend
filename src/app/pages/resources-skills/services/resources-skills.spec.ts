import { TestBed } from '@angular/core/testing';

import { ResourcesSkills } from './resources-skills';

describe('ResourcesSkills', () => {
  let service: ResourcesSkills;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResourcesSkills);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
