import { TestBed } from '@angular/core/testing';

import { OrganizationStrategy } from './organization-strategy';

describe('OrganizationStrategy', () => {
  let service: OrganizationStrategy;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrganizationStrategy);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
