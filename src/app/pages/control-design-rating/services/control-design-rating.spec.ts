import { TestBed } from '@angular/core/testing';

import { ControlDesignRating } from './control-design-rating';

describe('ControlDesignRating', () => {
  let service: ControlDesignRating;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControlDesignRating);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
