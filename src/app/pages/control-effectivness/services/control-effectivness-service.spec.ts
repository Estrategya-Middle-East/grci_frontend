import { TestBed } from '@angular/core/testing';

import { ControlEffectivnessService } from './control-effectivness-service';

describe('ControlEffectivnessService', () => {
  let service: ControlEffectivnessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControlEffectivnessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
